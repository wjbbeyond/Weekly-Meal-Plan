
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MealType, DayOfWeek, Dish, WeeklyPlan } from './types';
import { translations } from './translations';
import { PlusIcon, TrashIcon, ArrowDownTrayIcon, SparklesIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import html2canvas from 'html2canvas';

const DAYS = Object.values(DayOfWeek);
const MEALS = Object.values(MealType);

const INITIAL_PLAN: WeeklyPlan = DAYS.reduce((acc, day) => {
  acc[day] = {
    [MealType.BREAKFAST]: [],
    [MealType.LUNCH]: [],
    [MealType.DINNER]: []
  };
  return acc;
}, {} as WeeklyPlan);

const PRESET_DISHES: Dish[] = [
  { id: '1', nameEn: 'Avocado Toast', nameZh: '牛油果吐司' },
  { id: '2', nameEn: 'Kung Pao Chicken', nameZh: '宫保鸡丁' },
  { id: '3', nameEn: 'Greek Salad', nameZh: '希腊沙拉' },
  { id: '4', nameEn: 'Mapo Tofu', nameZh: '麻婆豆腐' },
  { id: '5', nameEn: 'Beef Stir-fry', nameZh: '小炒牛肉' },
  { id: '6', nameEn: 'Oatmeal with Fruits', nameZh: '水果燕麦粥' },
  { id: '7', nameEn: 'Spaghetti Carbonara', nameZh: '卡波纳拉意面' },
];

export default function App() {
  const [plan, setPlan] = useState<WeeklyPlan>(INITIAL_PLAN);
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [activeCell, setActiveCell] = useState<{ day: DayOfWeek, meal: MealType } | null>(null);
  const [inputValue, setInputValue] = useState('');
  const exportRef = useRef<HTMLDivElement>(null);

  const t = (key: string) => (translations[lang] as any)[key] || key;

  const handleAddDish = (day: DayOfWeek, meal: MealType, dishName: string) => {
    if (!dishName.trim()) return;
    const newDish: Dish = {
      id: Math.random().toString(36).substr(2, 9),
      nameEn: lang === 'en' ? dishName : '',
      nameZh: lang === 'zh' ? dishName : ''
    };
    setPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: [...prev[day][meal], newDish]
      }
    }));
    setInputValue('');
    setActiveCell(null);
  };

  const removeDish = (day: DayOfWeek, meal: MealType, id: string) => {
    setPlan(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: prev[day][meal].filter(d => d.id !== id)
      }
    }));
  };

  const exportAsImage = async () => {
    if (!exportRef.current) return;
    const canvas = await html2canvas(exportRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });
    const link = document.createElement('a');
    link.download = `meal-plan-${new Date().getTime()}.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.9);
    link.click();
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            {t('title')}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium"
          >
            <GlobeAltIcon className="w-5 h-5" />
            {lang === 'zh' ? 'English' : '中文'}
          </button>
          <button 
            onClick={exportAsImage}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-shadow shadow-md hover:shadow-lg text-sm font-semibold"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            {t('export')}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto mt-8 px-4 sm:px-6">
        {/* Main Grid: Desktop view */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-4 border-b border-r border-slate-200 w-24"></th>
                {DAYS.map(day => (
                  <th key={day} className="p-4 border-b border-r border-slate-200 min-w-[160px] text-center">
                    <span className="block text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">
                      {lang === 'en' ? day.substring(0, 3) : t(day.toLowerCase().substring(0, 3))}
                    </span>
                    <span className="text-lg font-bold text-slate-800">{t(day.toLowerCase().substring(0, 3))}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MEALS.map(meal => (
                <tr key={meal} className="group">
                  <td className="p-4 border-b border-r border-slate-200 bg-slate-50 font-bold text-slate-600 text-center align-middle">
                    {t(meal.toLowerCase())}
                  </td>
                  {DAYS.map(day => (
                    <td key={`${day}-${meal}`} className="p-3 border-b border-r border-slate-200 relative align-top hover:bg-slate-50/50 transition-colors min-h-[120px]">
                      <div className="flex flex-col gap-2">
                        {plan[day][meal].map(dish => (
                          <div key={dish.id} className="group/item flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200 shadow-sm hover:border-indigo-300 transition-all">
                            <span className="text-sm text-slate-700 font-medium">
                              {lang === 'zh' ? (dish.nameZh || dish.nameEn) : (dish.nameEn || dish.nameZh)}
                            </span>
                            <button 
                              onClick={() => removeDish(day, meal, dish.id)}
                              className="opacity-0 group-hover/item:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        
                        <button 
                          onClick={() => setActiveCell({ day, meal })}
                          className="mt-1 flex items-center justify-center w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all"
                        >
                          <PlusIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Hidden Export Component (Horizontal Days, Vertical Meals) */}
      <div className="fixed -left-[9999px] top-0">
        <div ref={exportRef} className="p-10 bg-white w-[1200px]">
          <div className="mb-8 flex justify-between items-end border-b-2 border-indigo-600 pb-4">
            <div>
              <h1 className="text-4xl font-black text-indigo-900 mb-1">{t('title')}</h1>
              <p className="text-slate-500 font-medium uppercase tracking-widest">{new Date().toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="text-right text-slate-400 font-bold text-sm">
              GENERATED BY MEALPLANNER PRO
            </div>
          </div>
          
          <div className="grid grid-cols-8 border-2 border-slate-200 rounded-xl overflow-hidden">
             {/* Header Column */}
             <div className="flex flex-col">
                <div className="h-16 bg-slate-100 border-b border-r border-slate-200 flex items-center justify-center font-black text-slate-400 italic">DATE</div>
                {MEALS.map(meal => (
                  <div key={meal} className="flex-1 min-h-[200px] bg-slate-50 border-b border-r border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xl px-4 text-center leading-tight">
                    {t(meal.toLowerCase())}
                  </div>
                ))}
             </div>

             {/* Days Columns */}
             {DAYS.map(day => (
               <div key={day} className="flex flex-col">
                  <div className="h-16 bg-indigo-600 border-b border-r border-indigo-700 flex items-center justify-center font-bold text-white text-lg">
                    {t(day.toLowerCase().substring(0, 3))}
                  </div>
                  {MEALS.map(meal => (
                    <div key={`${day}-${meal}`} className="flex-1 min-h-[200px] p-4 border-b border-r border-slate-200 bg-white">
                      <div className="space-y-3">
                        {plan[day][meal].map(dish => (
                          <div key={dish.id} className="text-lg font-semibold text-slate-800 border-l-4 border-indigo-400 pl-3 py-1">
                            {lang === 'zh' ? (dish.nameZh || dish.nameEn) : (dish.nameEn || dish.nameZh)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
               </div>
             ))}
          </div>
          <footer className="mt-8 text-center text-slate-400 font-medium">
            Healthy Eating · Happy Living
          </footer>
        </div>
      </div>

      {/* Input Modal */}
      {activeCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {t(activeCell.day.toLowerCase().substring(0, 3))} - {t(activeCell.meal.toLowerCase())}
                </h3>
                <p className="text-sm text-slate-500">{t('addDish')}</p>
              </div>
              <button onClick={() => setActiveCell(null)} className="p-2 hover:bg-white rounded-full transition-colors">
                <TrashIcon className="w-5 h-5 text-slate-400 rotate-45" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t('inputCustom')}</label>
                <div className="flex gap-2">
                  <input 
                    autoFocus
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddDish(activeCell.day, activeCell.meal, inputValue)}
                    placeholder={t('dishPlaceholder')}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                  <button 
                    onClick={() => handleAddDish(activeCell.day, activeCell.meal, inputValue)}
                    className="px-6 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
                  >
                    {t('save')}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{t('selectFromLibrary')}</label>
                <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-2 hide-scrollbar">
                  {PRESET_DISHES.map(dish => (
                    <button
                      key={dish.id}
                      onClick={() => handleAddDish(activeCell.day, activeCell.meal, lang === 'zh' ? dish.nameZh : dish.nameEn)}
                      className="text-left px-3 py-2 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 text-sm font-medium text-slate-600 transition-all"
                    >
                      {lang === 'zh' ? dish.nameZh : dish.nameEn}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Menu (Mobile Friendly) */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <button 
          onClick={() => setPlan(INITIAL_PLAN)}
          className="p-4 bg-white border border-slate-200 text-slate-500 rounded-full shadow-lg hover:bg-red-50 hover:text-red-600 transition-all"
          title={t('clear')}
        >
          <TrashIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
