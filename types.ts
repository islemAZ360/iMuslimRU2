export type NavigationTab = 'home' | 'prayer' | 'scan' | 'health' | 'athkar' | 'profile';

export interface PrayerTime {
  name: string;
  time: string;
  icon: string;
}

export interface Achievement {
  title: string;
  value: string;
  icon: string;
  active?: boolean;
}

export interface UserProfile {
  name: string;
  title: string;
  avatar: string;
}

export interface DhikrStats {
  [category: string]: number;
}
