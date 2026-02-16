
import React, { useState } from 'react';
import { Category, Transaction } from '../types';
import { X } from 'lucide-react';

interface TransactionFormProps {
  onSubmit: (tx: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}

const CATEGORIES: Category[] = ['אוכל', 'תחבורה', 'קניות', 'חשבונות', 'פנאי ובידור', 'אחר'];

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'אוכל' as Category,
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;
    
    onSubmit({
      title: formData.title,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-100 ring-4 ring-indigo-50 text-right">
      <div className="flex justify-between items-center mb-4 flex-row-reverse">
        <h3 className="font-bold text-slate-900">הוספת הוצאה</h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">תיאור</label>
          <input 
            required
            type="text"
            placeholder="למשל: ארוחת צהריים"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-right"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">סכום (₪)</label>
            <input 
              required
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-right"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">קטגוריה</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none text-right"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">תאריך</label>
          <input 
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-right"
          />
        </div>

        <button 
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          הוסף הוצאה
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
