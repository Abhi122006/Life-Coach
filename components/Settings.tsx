import React from 'react';
import { User, Bell, Shield, Moon, LogOut, ChevronRight, Mail } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-500 mt-1">Manage your account and preferences.</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            A
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Alex Johnson</h3>
            <p className="text-slate-500">Free Plan • Level 3 Achiever</p>
          </div>
          <button className="ml-auto text-sm font-medium text-emerald-600 hover:text-emerald-700">
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
             <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Email</span>
             <div className="flex items-center gap-2 text-slate-700">
                <Mail size={16} />
                alex.johnson@example.com
             </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
             <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Member Since</span>
             <div className="text-slate-700 font-medium">September 2024</div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h3 className="font-bold text-lg text-slate-900">Preferences</h3>
        </div>
        
        <div className="divide-y divide-slate-50">
          <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <Bell size={20} />
              </div>
              <div className="text-left">
                <div className="font-medium text-slate-900">Notifications</div>
                <div className="text-sm text-slate-500">Manage your daily reminders</div>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>

          <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                <Moon size={20} />
              </div>
              <div className="text-left">
                <div className="font-medium text-slate-900">Appearance</div>
                <div className="text-sm text-slate-500">Switch between Light and Dark mode</div>
              </div>
            </div>
            <div className="text-sm font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Light</div>
          </button>

          <button className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Shield size={20} />
              </div>
              <div className="text-left">
                <div className="font-medium text-slate-900">Privacy & Data</div>
                <div className="text-sm text-slate-500">Control your AI data sharing</div>
              </div>
            </div>
            <ChevronRight size={20} className="text-slate-300" />
          </button>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button className="text-red-500 font-medium flex items-center gap-2 hover:bg-red-50 px-6 py-3 rounded-xl transition-colors">
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};