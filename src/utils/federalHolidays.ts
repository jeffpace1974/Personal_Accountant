export interface FederalHoliday {
  name: string;
  date: Date;
  observedDate: Date;
  description: string;
  isInaugurationDay?: boolean;
}

// Calculate federal holidays for a given year using the same logic as OPM
export const calculateFederalHolidays = (year: number): FederalHoliday[] => {
  const holidays: FederalHoliday[] = [];

  // Helper function to get the nth occurrence of a weekday in a month
  const getNthWeekdayOfMonth = (year: number, month: number, weekday: number, n: number): Date => {
    const firstDay = new Date(year, month, 1);
    const firstWeekday = firstDay.getDay();
    const firstOccurrence = 1 + (weekday - firstWeekday + 7) % 7;
    return new Date(year, month, firstOccurrence + (n - 1) * 7);
  };

  // Helper function to get the last occurrence of a weekday in a month
  const getLastWeekdayOfMonth = (year: number, month: number, weekday: number): Date => {
    const lastDay = new Date(year, month + 1, 0);
    const lastWeekday = lastDay.getDay();
    const daysBack = (lastWeekday - weekday + 7) % 7;
    return new Date(year, month, lastDay.getDate() - daysBack);
  };

  // Helper function to get observed date (federal employees get day off on nearest weekday)
  const getObservedDate = (actualDate: Date): Date => {
    const dayOfWeek = actualDate.getDay();
    if (dayOfWeek === 0) { // Sunday - observe on Monday
      return new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate() + 1);
    } else if (dayOfWeek === 6) { // Saturday - observe on Friday
      return new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate() - 1);
    }
    return actualDate;
  };

  // 1. New Year's Day - January 1
  const newYearsDay = new Date(year, 0, 1);
  holidays.push({
    name: "New Year's Day",
    date: newYearsDay,
    observedDate: getObservedDate(newYearsDay),
    description: "January 1st"
  });

  // 2. Martin Luther King Jr. Day - Third Monday in January
  const mlkDay = getNthWeekdayOfMonth(year, 0, 1, 3); // Third Monday (1) in January (0)
  holidays.push({
    name: "Birthday of Martin Luther King, Jr.",
    date: mlkDay,
    observedDate: mlkDay, // Always on Monday
    description: "Third Monday in January"
  });

  // 3. Inauguration Day - January 20th (only in years divisible by 4, and only for DC area federal employees)
  if (year % 4 === 1) { // Presidential inauguration years (2021, 2025, 2029, etc.)
    const inaugurationDay = new Date(year, 0, 20);
    holidays.push({
      name: "Inauguration Day",
      date: inaugurationDay,
      observedDate: getObservedDate(inaugurationDay),
      description: "January 20th (Federal employees in Washington, D.C. area only)",
      isInaugurationDay: true
    });
  }

  // 4. Washington's Birthday (Presidents' Day) - Third Monday in February
  const presidentsDay = getNthWeekdayOfMonth(year, 1, 1, 3); // Third Monday (1) in February (1)
  holidays.push({
    name: "Washington's Birthday",
    date: presidentsDay,
    observedDate: presidentsDay, // Always on Monday
    description: "Third Monday in February"
  });

  // 5. Memorial Day - Last Monday in May
  const memorialDay = getLastWeekdayOfMonth(year, 4, 1); // Last Monday (1) in May (4)
  holidays.push({
    name: "Memorial Day",
    date: memorialDay,
    observedDate: memorialDay, // Always on Monday
    description: "Last Monday in May"
  });

  // 6. Juneteenth National Independence Day - June 19
  const juneteenth = new Date(year, 5, 19);
  holidays.push({
    name: "Juneteenth National Independence Day",
    date: juneteenth,
    observedDate: getObservedDate(juneteenth),
    description: "June 19th"
  });

  // 7. Independence Day - July 4
  const independenceDay = new Date(year, 6, 4);
  holidays.push({
    name: "Independence Day",
    date: independenceDay,
    observedDate: getObservedDate(independenceDay),
    description: "July 4th"
  });

  // 8. Labor Day - First Monday in September
  const laborDay = getNthWeekdayOfMonth(year, 8, 1, 1); // First Monday (1) in September (8)
  holidays.push({
    name: "Labor Day",
    date: laborDay,
    observedDate: laborDay, // Always on Monday
    description: "First Monday in September"
  });

  // 9. Columbus Day - Second Monday in October
  const columbusDay = getNthWeekdayOfMonth(year, 9, 1, 2); // Second Monday (1) in October (9)
  holidays.push({
    name: "Columbus Day",
    date: columbusDay,
    observedDate: columbusDay, // Always on Monday
    description: "Second Monday in October"
  });

  // 10. Veterans Day - November 11
  const veteransDay = new Date(year, 10, 11);
  holidays.push({
    name: "Veterans Day",
    date: veteransDay,
    observedDate: getObservedDate(veteransDay),
    description: "November 11th"
  });

  // 11. Thanksgiving Day - Fourth Thursday in November
  const thanksgiving = getNthWeekdayOfMonth(year, 10, 4, 4); // Fourth Thursday (4) in November (10)
  holidays.push({
    name: "Thanksgiving Day",
    date: thanksgiving,
    observedDate: thanksgiving, // Always on Thursday
    description: "Fourth Thursday in November"
  });

  // 12. Christmas Day - December 25
  const christmasDay = new Date(year, 11, 25);
  holidays.push({
    name: "Christmas Day",
    date: christmasDay,
    observedDate: getObservedDate(christmasDay),
    description: "December 25th"
  });

  return holidays.sort((a, b) => a.date.getTime() - b.date.getTime());
};

// Get current year's federal holidays
export const getCurrentYearFederalHolidays = (): FederalHoliday[] => {
  return calculateFederalHolidays(new Date().getFullYear());
};

// Check if a date is a federal holiday
export const isFederalHoliday = (date: Date, year?: number): boolean => {
  const holidayYear = year || date.getFullYear();
  const holidays = calculateFederalHolidays(holidayYear);
  const dateString = date.toDateString();
  
  return holidays.some(holiday => 
    holiday.date.toDateString() === dateString || 
    holiday.observedDate.toDateString() === dateString
  );
};

// Get the federal holiday name for a specific date
export const getFederalHolidayName = (date: Date, year?: number): string | null => {
  const holidayYear = year || date.getFullYear();
  const holidays = calculateFederalHolidays(holidayYear);
  const dateString = date.toDateString();
  
  const holiday = holidays.find(holiday => 
    holiday.date.toDateString() === dateString || 
    holiday.observedDate.toDateString() === dateString
  );
  
  return holiday ? holiday.name : null;
};

// Generate OPM URL for current year
export const getOPMHolidayURL = (year?: number): string => {
  const currentYear = year || new Date().getFullYear();
  return `https://www.opm.gov/policy-data-oversight/pay-leave/federal-holidays/#url=${currentYear}`;
};