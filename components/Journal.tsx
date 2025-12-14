import React, { useState, useEffect, useRef } from 'react';
import { JournalEntry } from '../types';
import { analyzeJournalEntry } from '../services/geminiService';
import { PenLine, Calendar, Sparkles, Tag, Plus, Loader2, ChevronDown, ChevronUp, Book, Lightbulb, Mic, MicOff, MessageCircleQuestion } from 'lucide-react';

interface JournalProps {
  entries: JournalEntry[];
  onAddEntry: (entry: JournalEntry) => void;
}

const JournalCard: React.FC<{ entry: JournalEntry }> = ({ entry }) => {
  const [showInsights, setShowInsights] = useState(false);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
          <Calendar size={16} className="text-emerald-500" />
          <span>{entry.date}</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1
          ${entry.sentiment === 'Positive' ? 'bg-emerald-50 text-emerald-600' : 
            entry.sentiment === 'Negative' ? 'bg-red-50 text-red-600' : 
            'bg-slate-50 text-slate-600'}`}>
           <span className={`w-1.5 h-1.5 rounded-full ${
             entry.sentiment === 'Positive' ? 'bg-emerald-500' : 
             entry.sentiment === 'Negative' ? 'bg-red-500' : 
             'bg-slate-400'
           }`}></span>
          {entry.sentiment}
        </div>
      </div>
      
      {/* Emotion Badges */}
      {entry.emotions && entry.emotions.length > 0 && (
         <div className="flex flex-wrap gap-2 mb-4">
            {entry.emotions.map(emotion => (
               <span key={emotion} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-600 border border-purple-100 uppercase tracking-wide">
                  {emotion}
               </span>
            ))}
         </div>
      )}
      
      <div className="prose prose-slate max-w-none mb-4">
        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-base">
          {entry.content}
        </p>
      </div>

      <div className="border-t border-slate-50 pt-3 mt-4">
        <button 
          onClick={() => setShowInsights(!showInsights)}
          className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors w-full justify-center py-2 bg-indigo-50/50 hover:bg-indigo-50 rounded-xl"
        >
          <Sparkles size={16} />
          <span>{showInsights ? 'Hide AI Analysis' : 'View AI Insights'}</span>
          {showInsights ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showInsights && (
          <div className="mt-4 animate-fade-in space-y-4">
            {/* Philosophical Insight */}
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-4 border border-indigo-100/50">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-500 shrink-0">
                   <Sparkles size={18} />
                </div>
                <div>
                  <span className="text-xs font-bold text-indigo-400 uppercase block mb-1 tracking-wider">Kairos Insight</span>
                  <p className="text-indigo-900 text-sm font-medium leading-relaxed italic">"{entry.aiInsight}"</p>
                </div>
              </div>
            </div>

            {/* Reflection Question */}
            {entry.reflectionQuestion && (
               <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-4 border border-blue-100/50">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-blue-500 shrink-0">
                     <MessageCircleQuestion size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-blue-400 uppercase block mb-1 tracking-wider">Deep Reflection</span>
                    <p className="text-blue-900 text-sm font-medium leading-relaxed">"{entry.reflectionQuestion}"</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actionable Tip */}
            {entry.actionableTip && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100/50">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-emerald-500 shrink-0">
                     <Lightbulb size={18} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase block mb-1 tracking-wider">Actionable Tip</span>
                    <p className="text-emerald-900 text-sm font-medium leading-relaxed">"{entry.actionableTip}"</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {entry.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                  <Tag size={12} className="text-slate-400" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Journal: React.FC<JournalProps> = ({ entries, onAddEntry }) => {
  const [isWriting, setIsWriting] = useState(false);
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
             finalTranscript += event.results[i][0].transcript + ' ';
          } else {
             interimTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
           setContent(prev => prev + finalTranscript);
        }
      };
      
      recognitionRef.current.onend = () => {
         if (isListening) {
            // Restart if it stopped unexpectedly while state is listening
            // but for simple UI logic, let's just sync state
            setIsListening(false);
         }
      };
      
      recognitionRef.current.onerror = (event: any) => {
         console.error("Speech recognition error", event.error);
         setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
     if (!recognitionRef.current) {
        alert("Voice input is not supported in this browser.");
        return;
     }

     if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
     } else {
        recognitionRef.current.start();
        setIsListening(true);
     }
  };

  const handleSave = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeJournalEntry(content);
      
      const newEntry: JournalEntry = {
        id: crypto.randomUUID(),
        // Improved date formatting
        date: new Date().toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        content,
        emotions: [], // Fallback if not returned, though service ensures it is
        ...analysis
      };

      onAddEntry(newEntry);
      setContent('');
      setIsWriting(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isWriting) {
    return (
      <div className="h-full flex flex-col animate-fade-in bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden max-w-3xl mx-auto">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <PenLine size={20} />
            New Entry
          </h2>
          <button onClick={() => setIsWriting(false)} className="text-slate-400 hover:text-slate-600">
            Cancel
          </button>
        </div>
        <div className="flex-1 p-6 relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write or dictate your thoughts here..."
            className="w-full h-full resize-none outline-none text-lg text-slate-700 placeholder-slate-300 bg-transparent font-light leading-relaxed pb-12"
            autoFocus
          />
          {/* Voice Button positioned inside text area */}
          <button 
             onClick={toggleListening}
             className={`absolute bottom-6 right-6 p-4 rounded-full shadow-lg transition-all ${
                isListening 
                   ? 'bg-red-500 text-white animate-pulse shadow-red-200' 
                   : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
             }`}
             title={isListening ? "Stop Recording" : "Start Dictation"}
          >
             {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
        </div>
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isAnalyzing || !content}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2 transition-all shadow-lg shadow-slate-200"
          >
            {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            <span>Analyze & Save</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Journal</h2>
          <p className="text-slate-500">Reflect and grow with AI insights.</p>
        </div>
        <button
          onClick={() => setIsWriting(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-emerald-700 flex items-center gap-2 shadow-sm transition-all shadow-emerald-200"
        >
          <Plus size={20} />
          <span>Write</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {entries.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Book size={32} />
            </div>
            <p className="text-slate-400">Your journal is empty.</p>
          </div>
        ) : (
          entries.map(entry => (
            <JournalCard key={entry.id} entry={entry} />
          ))
        )}
      </div>
    </div>
  );
};