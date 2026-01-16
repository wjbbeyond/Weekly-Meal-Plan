
export enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER'
}

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}

export interface Dish {
  id: string;
  nameEn: string;
  nameZh: string;
}

export type WeeklyPlan = Record<DayOfWeek, Record<MealType, Dish[]>>;

export interface LanguageContextType {
  lang: 'en' | 'zh';
  setLang: (l: 'en' | 'zh') => void;
  t: (key: string) => string;
}
