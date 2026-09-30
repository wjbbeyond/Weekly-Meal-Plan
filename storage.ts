import { DayOfWeek, MealType, WeeklyPlan } from './types';
export const STORAGE_KEY = 'weekly-meal-plan-v1';
export function readPlan(storage: Pick<Storage, 'getItem'>): {plan: WeeklyPlan; lang: 'zh' | 'en'} | null {
  try {
    const saved = JSON.parse(storage.getItem(STORAGE_KEY) || 'null');
    if (!saved || saved.version !== 1 || !['zh','en'].includes(saved.lang)) return null;
    for (const day of Object.values(DayOfWeek)) {
      for (const meal of Object.values(MealType)) {
        const dishes = saved.plan?.[day]?.[meal];
        if (!Array.isArray(dishes) || dishes.length > 100 || dishes.some(d => !d ||
            !['id','nameEn','nameZh'].every(key => typeof d[key] === 'string' && d[key].length <= 1000))) return null;
      }
    }
    return saved;
  } catch { return null; }
}
