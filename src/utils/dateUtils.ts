import { format, addDays, isWeekend, startOfDay, addMonths, differenceInDays } from 'date-fns';
import { getCurrentYearBankHolidays } from './bankHolidays';
import { getCurrentYearFederalHolidays } from './federalHolidays';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy');
};

export const formatDateShort = (date: Date): string => {
  return format(date, 'MM/dd');
};

export const adjustPayDateForWeekend = (date: Date): Date => {
  if (isWeekend(date)) {
    // Move to Friday if it's a weekend
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) { // Sunday
      return addDays(date, -2);
    } else if (dayOfWeek === 6) { // Saturday
      return addDays(date, -1);
    }
  }
  return date;
};

export const adjustPayDateForHoliday = (date: Date, customHolidays: Date[] = [], useFederal: boolean = false): Date => {
  const adjustedDate = adjustPayDateForWeekend(date);
  
  // Get current year's holidays based on preference
  const bankHolidays = getCurrentYearBankHolidays();
  const federalHolidays = getCurrentYearFederalHolidays();
  
  const holidayDates = useFederal 
    ? federalHolidays.map(h => h.observedDate)
    : bankHolidays.map(h => h.observedDate);
    
  const allHolidayDates = [
    ...holidayDates,
    ...customHolidays
  ];
  
  // Check if the date falls on a holiday
  const isHoliday = allHolidayDates.some(holiday => 
    format(holiday, 'yyyy-MM-dd') === format(adjustedDate, 'yyyy-MM-dd')
  );
  
  if (isHoliday) {
    // Move to the previous business day
    let newDate = addDays(adjustedDate, -1);
    while (isWeekend(newDate) || allHolidayDates.some(holiday => 
      format(holiday, 'yyyy-MM-dd') === format(newDate, 'yyyy-MM-dd')
    )) {
      newDate = addDays(newDate, -1);
    }
    return newDate;
  }
  
  return adjustedDate;
};

export const calculateDaysUntilPayday = (nextPayDate: Date): number => {
  const today = startOfDay(new Date());
  const payDate = startOfDay(nextPayDate);
  return differenceInDays(payDate, today);
};

export const getNextPayDate = (frequency: string, lastPayDate: Date): Date => {
  const today = new Date();
  
  switch (frequency) {
    case 'weekly':
      return addDays(lastPayDate, 7);
    case 'bi-weekly':
      return addDays(lastPayDate, 14);
    case 'monthly':
      return addMonths(lastPayDate, 1);
    case 'bi-monthly':
      // Assuming 15th and last day of month
      const day = lastPayDate.getDate();
      if (day === 15) {
        // Next pay is last day of month
        const nextMonth = addMonths(lastPayDate, 1);
        return new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 0);
      } else {
        // Next pay is 15th of next month
        return new Date(lastPayDate.getFullYear(), lastPayDate.getMonth() + 1, 15);
      }
    default:
      return addDays(today, 7);
  }
};

export const calculateDailySpendingLimit = (
  remainingBudget: number,
  daysUntilPayday: number
): number => {
  if (daysUntilPayday <= 0) return 0;
  return Math.max(0, remainingBudget / daysUntilPayday);
};

export const isDateInCurrentMonth = (date: Date): boolean => {
  const today = new Date();
  return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
};

export const getStartOfCurrentMonth = (): Date => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1);
};

export const getEndOfCurrentMonth = (): Date => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth() + 1, 0);
};