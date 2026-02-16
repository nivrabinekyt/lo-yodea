
import React from 'react';
import { Transaction, Category } from '../types';
import { Utensils, Car, ShoppingBag, Zap, Clapperboard, MoreHorizontal, Trash2 } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  'אוכל': <Utensils className="w-4 h-4" />,
  'תחבורה': <Car className="w-4 h-4" />,
  'קניות': <ShoppingBag className="w-4 h-4" />,
  'חשבונות': <Zap className="w-4 h-4" />,
  'פנאי ובידור': <Clapperboard className="w-4 h-4" />,
  'אחר': <MoreHorizontal className="w-4 h-4" />
};

const CATEGORY_BG: Record<Category, string> = {
  'אוכל': 'bg-indigo-50 text-indigo-600',
  'תחבורה': 'bg-emerald-50 text-emerald-600',
  'קניות': 'bg-amber-50 text-amber-600',
  'חשבונות': 'bg-red-50 text-red-600',
  'פנאי ובידור': 'bg-violet-50 text-violet-600',
  'אחר': 'bg-slate-100 text-slate-600'
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-slate-500 font-medium">אין עסקאות עדיין.</p>
        <p className="text-sm text-slate-400">הוסיפו עסקה למעלה כדי להתחיל!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 text-right">
      {transactions.map((tx) => (
        <div 
          key={tx.id} 
          className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all duration-200 flex-row-reverse"
        >
          <div className="flex items-center gap-4 flex-row-reverse">
            <div className={`p-3 rounded-xl ${CATEGORY_BG[tx.category]}`}>
              {CATEGORY_ICONS[tx.category]}
            </div>
            <div>
              <h4 className="font-bold text-slate-800 leading-none mb-1">{tx.title}</h4>
              <div className="flex items-center gap-2 flex-row-reverse">
                <span className="text-xs text-slate-400">{new Date(tx.date).toLocaleDateString('he-IL')}</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded font-bold uppercase tracking-wider">{tx.category}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 flex-row-reverse">
            <div className="text-left">
              <span className="text-lg font-bold text-slate-900">₪{tx.amount.toFixed(2)}-</span>
            </div>
            <button 
              onClick={() => onDelete(tx.id)}
              className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
