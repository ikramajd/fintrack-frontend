export type TransactionType = 'INCOME' | 'EXPENSE';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  monthlyBudget?: number;
}

export interface Transaction {
  id: number;
  amount: number;
  type: TransactionType;
  description: string;
  date: string;
  categoryId: number;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
}

export interface Goal {
  id: number;
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  color: string;
  icon: string;
  deadline: string;
  progressPercent: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export interface CategorySpend {
  category: string;
  color: string;
  amount: number;
  percentage: number;
}

export interface BudgetAlert {
  category: string;
  color: string;
  budget: number;
  spent: number;
  percentage: number;
  overBudget: boolean;
}

export interface SubScore {
  name: string;
  icon: string;
  score: number;
  maxScore: number;
  description: string;
}

export interface HealthScore {
  score: number;
  grade: string;
  color: string;
  tip: string;
  breakdown: SubScore[];
}

export interface Dashboard {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlyData: MonthlyData[];
  categorySpends: CategorySpend[];
  recentTransactions: Transaction[];
  insights: string[];
  budgetAlerts: BudgetAlert[];
  healthScore: HealthScore;
}

export interface TransactionFilter {
  startDate?: string;
  endDate?: string;
  type?: TransactionType;
  categoryId?: number;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}
