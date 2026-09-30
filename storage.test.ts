import { expect, it } from 'vitest';
import { readPlan } from './storage';
import { DayOfWeek, MealType } from './types';
const plan = Object.fromEntries(Object.values(DayOfWeek).map(day => [day,Object.fromEntries(Object.values(MealType).map(meal => [meal, [{id:'1',nameEn:'Rice',nameZh:'米饭'}]]))]));
it('restores a complete versioned plan', () => {
 expect(readPlan({getItem: () => JSON.stringify({version:1,plan,lang:'zh'})})).toMatchObject({plan,lang:'zh'});
});
it('rejects malformed or unsupported saved data', () => {
 for (const value of ['invalid','null',JSON.stringify({version:2,plan,lang:'zh'}),JSON.stringify({version:1,plan:{},lang:'zh'})]) expect(readPlan({getItem: () => value})).toBeNull();
});
it('handles blocked browser storage', () => {
 expect(readPlan({getItem: () => {throw new Error('denied');}})).toBeNull();
});
