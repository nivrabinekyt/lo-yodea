
import React, { useState } from 'react';
import { UserSettings } from '../types';
import { Wallet, Settings, X, Check } from 'lucide-react';

interface NavbarProps {
  settings: UserSettings;
  setSettings: (s: UserSettings) => void;
}

const Navbar: React.FC<NavbarProps> = ({ settings, setSettings }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(settings);

  const handleSave = () => {
    setSettings(editForm);
    setIsEditing(false);
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 flex-row-reverse">
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-100">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <h1 className="text-xl font-bold text-slate-900 leading-tight">
                {settings.appTitle}
              </h1>
              <p className="text-sm text-slate-500">
                {settings.appSubtitle}
              </p>
            </div>
          </div>

          <button 
            onClick={() => setIsEditing(true)}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200 text-right">
            <div className="flex justify-between items-center mb-6 flex-row-reverse">
              <h3 className="text-lg font-bold text-slate-900">הגדרות כותרת</h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">כותרת האפליקציה</label>
                <input 
                  type="text"
                  value={editForm.appTitle}
                  onChange={(e) => setEditForm({ ...editForm, appTitle: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">כותרת משנה</label>
                <input 
                  type="text"
                  value={editForm.appSubtitle}
                  onChange={(e) => setEditForm({ ...editForm, appSubtitle: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-right"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3 flex-row-reverse">
              <button 
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2.5 px-4 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
              >
                ביטול
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 py-2.5 px-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                שמור שינויים
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
