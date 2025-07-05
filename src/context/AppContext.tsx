import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { 
  Account, 
  Transaction, 
  Category, 
  Budget, 
  Goal, 
  IncomeStream, 
  Holiday, 
  DashboardData,
  BudgetAdjustment,
  BudgetTemplate 
} from '../types';
import { 
  mockAccounts, 
  mockTransactions, 
  mockCategories, 
  mockBudgets, 
  mockGoals, 
  mockIncomeStreams, 
  mockHolidays,
  generateMockDashboardData 
} from '../data/mockData';

interface AppState {
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  goals: Goal[];
  incomeStreams: IncomeStream[];
  holidays: Holiday[];
  dashboardData: DashboardData;
  budgetAdjustments: BudgetAdjustment[];
  budgetTemplates: BudgetTemplate[];
  loading: boolean;
  error: string | null;
}

type AppAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ACCOUNTS'; payload: Account[] }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_BUDGETS'; payload: Budget[] }
  | { type: 'SET_GOALS'; payload: Goal[] }
  | { type: 'SET_INCOME_STREAMS'; payload: IncomeStream[] }
  | { type: 'SET_HOLIDAYS'; payload: Holiday[] }
  | { type: 'SET_DASHBOARD_DATA'; payload: DashboardData }
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'UPDATE_ACCOUNT'; payload: Account }
  | { type: 'DELETE_ACCOUNT'; payload: string }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'ADD_BUDGET'; payload: Budget }
  | { type: 'UPDATE_BUDGET'; payload: Budget }
  | { type: 'DELETE_BUDGET'; payload: string }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: Goal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'ADD_INCOME_STREAM'; payload: IncomeStream }
  | { type: 'UPDATE_INCOME_STREAM'; payload: IncomeStream }
  | { type: 'DELETE_INCOME_STREAM'; payload: string }
  | { type: 'ADD_HOLIDAY'; payload: Holiday }
  | { type: 'UPDATE_HOLIDAY'; payload: Holiday }
  | { type: 'DELETE_HOLIDAY'; payload: string }
  | { type: 'ADD_BUDGET_ADJUSTMENT'; payload: BudgetAdjustment }
  | { type: 'ADD_BUDGET_TEMPLATE'; payload: BudgetTemplate }
  | { type: 'UPDATE_BUDGET_TEMPLATE'; payload: BudgetTemplate }
  | { type: 'DELETE_BUDGET_TEMPLATE'; payload: string };

const initialState: AppState = {
  accounts: [],
  transactions: [],
  categories: [],
  budgets: [],
  goals: [],
  incomeStreams: [],
  holidays: [],
  dashboardData: generateMockDashboardData(),
  budgetAdjustments: [],
  budgetTemplates: [],
  loading: false,
  error: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_ACCOUNTS':
      return { ...state, accounts: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_BUDGETS':
      return { ...state, budgets: action.payload };
    case 'SET_GOALS':
      return { ...state, goals: action.payload };
    case 'SET_INCOME_STREAMS':
      return { ...state, incomeStreams: action.payload };
    case 'SET_HOLIDAYS':
      return { ...state, holidays: action.payload };
    case 'SET_DASHBOARD_DATA':
      return { ...state, dashboardData: action.payload };
    case 'ADD_ACCOUNT':
      return { ...state, accounts: [...state.accounts, action.payload] };
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.map(account =>
          account.id === action.payload.id ? action.payload : account
        ),
      };
    case 'DELETE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.filter(account => account.id !== action.payload),
      };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(transaction =>
          transaction.id === action.payload.id ? action.payload : transaction
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction.id !== action.payload),
      };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id ? action.payload : category
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload),
      };
    case 'ADD_BUDGET':
      return { ...state, budgets: [...state.budgets, action.payload] };
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(budget =>
          budget.id === action.payload.id ? action.payload : budget
        ),
      };
    case 'DELETE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.filter(budget => budget.id !== action.payload),
      };
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(goal =>
          goal.id === action.payload.id ? action.payload : goal
        ),
      };
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter(goal => goal.id !== action.payload),
      };
    case 'ADD_INCOME_STREAM':
      return { ...state, incomeStreams: [...state.incomeStreams, action.payload] };
    case 'UPDATE_INCOME_STREAM':
      return {
        ...state,
        incomeStreams: state.incomeStreams.map(stream =>
          stream.id === action.payload.id ? action.payload : stream
        ),
      };
    case 'DELETE_INCOME_STREAM':
      return {
        ...state,
        incomeStreams: state.incomeStreams.filter(stream => stream.id !== action.payload),
      };
    case 'ADD_HOLIDAY':
      return { ...state, holidays: [...state.holidays, action.payload] };
    case 'UPDATE_HOLIDAY':
      return {
        ...state,
        holidays: state.holidays.map(holiday =>
          holiday.id === action.payload.id ? action.payload : holiday
        ),
      };
    case 'DELETE_HOLIDAY':
      return {
        ...state,
        holidays: state.holidays.filter(holiday => holiday.id !== action.payload),
      };
    case 'ADD_BUDGET_ADJUSTMENT':
      return { ...state, budgetAdjustments: [...state.budgetAdjustments, action.payload] };
    case 'ADD_BUDGET_TEMPLATE':
      return { ...state, budgetTemplates: [...state.budgetTemplates, action.payload] };
    case 'UPDATE_BUDGET_TEMPLATE':
      return {
        ...state,
        budgetTemplates: state.budgetTemplates.map(template =>
          template.id === action.payload.id ? action.payload : template
        ),
      };
    case 'DELETE_BUDGET_TEMPLATE':
      return {
        ...state,
        budgetTemplates: state.budgetTemplates.filter(template => template.id !== action.payload),
      };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Initialize with mock data
    dispatch({ type: 'SET_ACCOUNTS', payload: mockAccounts });
    dispatch({ type: 'SET_TRANSACTIONS', payload: mockTransactions });
    dispatch({ type: 'SET_CATEGORIES', payload: mockCategories });
    dispatch({ type: 'SET_BUDGETS', payload: mockBudgets });
    dispatch({ type: 'SET_GOALS', payload: mockGoals });
    dispatch({ type: 'SET_INCOME_STREAMS', payload: mockIncomeStreams });
    dispatch({ type: 'SET_HOLIDAYS', payload: mockHolidays });
    dispatch({ type: 'SET_DASHBOARD_DATA', payload: generateMockDashboardData() });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};