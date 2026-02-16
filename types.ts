
export type Category = 'אוכל' | 'תחבורה' | 'קניות' | 'חשבונות' | 'פנאי ובידור' | 'אחר';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string;
}

export interface UserSettings {
  appTitle: string;
  appSubtitle: string;
}

export interface AIInsight {
  summary: string;
  tip: string;
}
