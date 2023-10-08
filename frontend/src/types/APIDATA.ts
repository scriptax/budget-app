export interface BudgetData {
  _id: string;
  name: string;
  amount: number;
  spent: number;
  category: string;
  active?: boolean;
  setAt?: string;
  user?: string;
  __v?: number;
  id?: string;
}

export interface BudgetWithExpenseData extends BudgetData {
  expenses: ExpenseData[];
}

export interface ExpenseData {
  _id: string;
  name: string;
  amount: number;
  budget: string;
  user: string;
  setAt: string;
}

export interface IncomeData {
  _id: string;
  name: string;
  amount: number;
  category: string;
  user: string;
  setAt: string;
}

export interface DashboardData {
  _id: string;
  name: string;
  email: string;
  currentBalance: number;
  preferredCurrency: string;
  totalExpense: number;
  totalIncome: number;
  budgets: BudgetData[];
}
