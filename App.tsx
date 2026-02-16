
import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, Category, UserSettings, AIInsight } from './types';
import { getFinancialInsights } from './services/geminiService';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import { Info, Plus, TrendingUp } from 'lucide-react';

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', title: 'קניות בסופר', amount: 85.50, category: 'אוכל', date: '2024-03-01' },
  { id: '2', title: 'תדלוק רכב', amount: 45.00, category: 'תחבורה', date: '2024-03-05' },
  { id: '3', title: 'חשבון חשמל', amount: 120.00, category: 'חשבונות', date: '2024-03-10' },
  { id: '4', title: 'נעליים חדשות', amount: 75.00, category: 'קניות', date: '2024-03-12' },
  { id: '5', title: 'ערב סרט', amount: 30.00, category: 'פנאי ובידור', date: '2024-03-15' },
  { id: '6', title: 'כרטיס רב-קו', amount: 25.00, category: 'תחבורה', date: '2024-03-20' },
];

const App: React.FC = () => {
  // טעינת נתונים ראשונית מ-LocalStorage
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('ff_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('ff_settings');
    return saved ? JSON.parse(saved) : {
      appTitle: "הפיננסים שלי",
      appSubtitle: "מעקב חכם אחר הוצאות והרגלי צריכה"
    };
  });

  const [insights, setInsights] = useState<AIInsight | null>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // שמירת נתונים בכל שינוי
  useEffect(() => {
    localStorage.setItem('ff_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('ff_settings', JSON.stringify(settings));
  }, [settings]);

  const averageMonthlySpending = useMemo(() => {
    if (transactions.length === 0) return 0;
    const total = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    const months = new Set(transactions.map(t => t.date.substring(0, 7)));
    return total / (months.size || 1);
  }, [transactions]);

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const txWithId = { ...newTx, id: Math.random().toString(36).substr(2, 9) };
    setTransactions(prev => [txWithId, ...prev]);
    setShowAddForm(false);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק עסקה זו?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const refreshInsights = async () => {
    setIsInsightLoading(true);
    const data = await getFinancialInsights(transactions);
    setInsights(data);
    setIsInsightLoading(false);
  };

  useEffect(() => {
    refreshInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen pb-12">
      <Navbar settings={settings} setSettings={setSettings} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 text-right">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* עמודה ימנית: סטטיסטיקה וגרפים */}
          <div className="flex-1 space-y-8 order-2 lg:order-1">
            <Dashboard 
              transactions={transactions} 
              averageMonthlySpending={averageMonthlySpending}
            />

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
              <div className="flex items-center justify-between mb-6 flex-row-reverse">
                <div className="flex items-center gap-2 flex-row-reverse">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">תובנות AI פיננסיות</h2>
                </div>
                <button 
                  onClick={refreshInsights}
                  disabled={isInsightLoading}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                >
                  {isInsightLoading ? 'מנתח...' : 'רענן תובנות'}
                </button>
              </div>

              {insights ? (
                <div className="space-y-4 animate-in fade-in duration-500">
                  <div className="p-4 bg-slate-50 rounded-xl border-r-4 border-indigo-500">
                    <p className="text-slate-600 italic">"{insights.summary}"</p>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex-row-reverse">
                    <Info className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-emerald-800">טיפ לחיסכון</p>
                      <p className="text-emerald-700 text-sm">{insights.tip}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center text-slate-400">
                  טוען תובנות...
                </div>
              )}
            </div>
          </div>

          {/* עמודה שמאלית: עסקאות */}
          <div className="w-full lg:w-[400px] space-y-6 order-1 lg:order-2">
            <div className="flex items-center justify-between flex-row-reverse">
              <h2 className="text-xl font-bold text-slate-800">עסקאות אחרונות</h2>
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                הוספה
              </button>
            </div>

            {showAddForm && (
              <div className="animate-in slide-in-from-top duration-300">
                <TransactionForm onSubmit={handleAddTransaction} onCancel={() => setShowAddForm(false)} />
              </div>
            )}

            <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
