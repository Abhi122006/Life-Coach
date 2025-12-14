import { GoogleGenAI, Type, LiveServerMessage, Modality } from "@google/genai";
import { Goal, JournalEntry } from "../types";
import { createPcmBlob, decodeAudioData, base64ToUint8Array } from "./audioUtils";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// --- Structured Data Generation (Goals) ---

export const generateGoalBreakdown = async (goalTitle: string): Promise<Goal> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Create a structured breakdown for the goal: "${goalTitle}". Provide 3-5 actionable milestones.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          category: { type: Type.STRING, enum: ["Health", "Career", "Personal", "Finance", "Learning"] },
          milestones: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                estimatedTime: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  const data = JSON.parse(response.text || "{}");
  
  return {
    id: crypto.randomUUID(),
    title: data.title || goalTitle,
    category: data.category || "Personal",
    progress: 0,
    milestones: (data.milestones || []).map((m: any) => ({ ...m, completed: false })),
    isAIGenerated: true
  };
};

// --- Journal Analysis ---

export const analyzeJournalEntry = async (text: string): Promise<Omit<JournalEntry, 'id' | 'date' | 'content'>> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Analyze this journal entry: "${text}". Determine the overall sentiment, identify 2-4 specific human emotions present (e.g. Joy, Anxiety, Pride, Nostalgia), extract 3 short topic tags, provide a one-sentence philosophical or supportive insight, a single specific actionable tip, and a deep reflection question to help the user explore their thoughts further.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sentiment: { type: Type.STRING, enum: ["Positive", "Neutral", "Negative", "Mixed"] },
          emotions: { type: Type.ARRAY, items: { type: Type.STRING } },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          aiInsight: { type: Type.STRING },
          actionableTip: { type: Type.STRING },
          reflectionQuestion: { type: Type.STRING }
        }
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

// --- Daily Check-in & Tasks ---

export const generateDailyCheckIn = async (mood: number, energy: number, note?: string): Promise<{ tip: string; tasks: string[] }> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `The user checked in with Mood: ${mood}/10, Energy: ${energy}/10. Note: "${note || ''}". Provide a single, short, actionable micro-coaching tip (max 20 words) and 3 simple, specific, mood-appropriate tasks/activities the user could do right now (max 5 words each) to improve or maintain their state.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tip: { type: Type.STRING },
          tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });
  return JSON.parse(response.text || '{"tip": "Take a moment to breathe.", "tasks": ["Deep breathing", "Drink water", "Stretch"]}');
};

// --- Zen Zone ---

export const generateMantra = async (mood: string = "calm"): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Generate a short, powerful, modern daily mantra or affirmation for someone feeling "${mood}". Max 15 words. Do not use quotes.`,
    });
    return response.text || "Breathe in peace, breathe out tension.";
  } catch (e) {
      return "Focus on the present moment.";
  }
};

// --- Live API Client Class ---

export class LiveClient {
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private nextStartTime = 0;
  private sources = new Set<AudioBufferSourceNode>();
  private session: any = null; // Session type is internal to the SDK mostly
  private stream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;

  constructor(private onStatusChange: (status: 'disconnected' | 'connecting' | 'connected' | 'error') => void) {}

  async connect() {
    this.onStatusChange('connecting');

    try {
      this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            this.onStatusChange('connected');
            this.startAudioInput(sessionPromise);
          },
          onmessage: (message: LiveServerMessage) => this.handleMessage(message),
          onclose: () => this.disconnect(),
          onerror: (e) => {
            console.error(e);
            this.onStatusChange('error');
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } 
          },
          systemInstruction: "You are Kairos, an empathetic, motivating, and adaptive life coach. Keep responses concise (under 30 seconds usually) and conversational. Ask probing questions to help the user uncover their own solutions. If the user is stressed, be calming. If they are low energy, be uplifting."
        }
      });
      
      this.session = sessionPromise;

    } catch (error) {
      console.error("Connection failed", error);
      this.onStatusChange('error');
    }
  }

  private startAudioInput(sessionPromise: Promise<any>) {
    if (!this.inputAudioContext || !this.stream) return;

    this.sourceNode = this.inputAudioContext.createMediaStreamSource(this.stream);
    this.processor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);

    this.processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      const pcmBlob = createPcmBlob(inputData);
      
      sessionPromise.then(session => {
        session.sendRealtimeInput({ media: pcmBlob });
      });
    };

    this.sourceNode.connect(this.processor);
    this.processor.connect(this.inputAudioContext.destination);
  }

  private async handleMessage(message: LiveServerMessage) {
    if (!this.outputAudioContext) return;

    const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
    
    if (base64Audio) {
        // Ensure precise timing
        this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);

        const audioBytes = base64ToUint8Array(base64Audio);
        const audioBuffer = await decodeAudioData(audioBytes, this.outputAudioContext);

        const source = this.outputAudioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.outputAudioContext.destination);
        
        source.addEventListener('ended', () => {
            this.sources.delete(source);
        });

        source.start(this.nextStartTime);
        this.nextStartTime += audioBuffer.duration;
        this.sources.add(source);
    }
    
    if (message.serverContent?.interrupted) {
        this.stopAudioOutput();
    }
  }

  private stopAudioOutput() {
    this.sources.forEach(source => {
        try { source.stop(); } catch(e) {} 
    });
    this.sources.clear();
    this.nextStartTime = 0;
  }

  disconnect() {
    this.stopAudioOutput();
    
    // Cleanup Input
    if (this.processor) {
        this.processor.disconnect();
        this.processor.onaudioprocess = null;
    }
    if (this.sourceNode) this.sourceNode.disconnect();
    if (this.stream) this.stream.getTracks().forEach(t => t.stop());
    if (this.inputAudioContext) this.inputAudioContext.close();
    
    // Cleanup Output
    if (this.outputAudioContext) this.outputAudioContext.close();

    // Reset State
    this.inputAudioContext = null;
    this.outputAudioContext = null;
    this.stream = null;
    this.processor = null;
    
    if(this.session) {
       // Best effort close
       this.session.then((s: any) => s.close && s.close());
    }

    this.onStatusChange('disconnected');
  }
}