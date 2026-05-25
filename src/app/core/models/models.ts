export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
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
  createdAt: string;
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
  amount: number;
  percentage: number;
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
}

export interface AuthResponse {
  token: string;
  name: string;
  email: string;
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
