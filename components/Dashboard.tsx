
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Transaction, Category } from '../types';
import { DollarSign, TrendingDown, LayoutGrid } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  averageMonthlySpending: number;
}

const CATEGORY_COLORS: Record<Category, string> = {
  'אוכל': '#6366f1',
  'תחבורה': '#10b981',
  'קניות': '#f59e0b',
  'חשבונות': '#ef4444',
  'פנאי ובידור': '#8b5cf6',
  'אחר': '#64748b'
};

const Dashboard: React.FC<DashboardProps> = ({ transactions, averageMonthlySpending }) => {
  const chartData = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
    const grouped: Record<string, number> = {};
    
    sorted.forEach(t => {
      grouped[t.date] = (grouped[t.date] || 0) + t.amount;
    });

    return Object.entries(grouped).map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString('he-IL', { month: 'short', day: 'numeric' }),
      amount
    }));
  }, [transactions]);

  const pieData = useMemo(() => {
    const categories: Record<string, number> = {};
    transactions.forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });
    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const totalSpending = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="space-y-8 text-right">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4 flex-row-reverse">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-sm font-semibold text-slate-500">סה"כ הוצאות</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">₪{totalSpending.toFixed(2)}</div>
          <div className="mt-2 text-xs text-slate-400">מתחילת המעקב</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4 flex-row-reverse">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <TrendingDown className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-sm font-semibold text-slate-500">ממוצע חודשי</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">₪{averageMonthlySpending.toFixed(2)}</div>
          <div className="mt-2 text-xs text-emerald-600 font-medium">יעד חודשי מחושב</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4 flex-row-reverse">
            <div className="p-2 bg-amber-50 rounded-lg">
              <LayoutGrid className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm font-semibold text-slate-500">קטגוריה מובילה</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {pieData[0]?.name || 'אין מידע'}
          </div>
          <div className="mt-2 text-xs text-slate-400">ההוצאה העיקרית שלך</div>
        </div>
      </div>

      {/* Main Graph */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6">מגמת הוצאות</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}} 
                dy={10}
              />
              <YAxis 
                orientation="right"
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}}
                tickFormatter={(val) => `₪${val}`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', textAlign: 'right' }}
                itemStyle={{ color: '#6366f1', fontWeight: 600 }}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorAmt)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart & Breakdown */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row-reverse gap-8 items-center">
        <div className="w-full md:w-1/2 h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as Category]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="w-full md:w-1/2 space-y-3">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">פירוט לפי קטגוריה</h4>
          {pieData.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between flex-row-reverse">
              <div className="flex items-center gap-2 flex-row-reverse">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[entry.name as Category] }} />
                <span className="text-slate-700 font-medium">{entry.name}</span>
              </div>
              <span className="text-slate-900 font-bold">₪{entry.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
