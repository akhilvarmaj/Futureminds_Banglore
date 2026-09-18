export type AgeGroup = '6-8' | '9-12' | '13-16' | 'all';

export type CourseCategory = 'coding' | 'ai' | 'robotics' | 'combo';

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  category: CourseCategory;
  ageGroup: '6-8' | '9-12' | '13-16';
  duration: string;
  projectsCount: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  keySkills: string[];
  toolsUsed: string[];
  featuredProject: string;
  badge: string;
  iconName: string;
}

export interface StudentProgress {
  id: string;
  name: string;
  age: number;
  enrolledCourse: string;
  level: string;
  joinedDate: string;
  overallEngagement: number; // 0 - 100%
  engagementTrend: 'up' | 'stable' | 'needs_attention';
  weeklyHours: number;
  streakDays: number;
  completedLessons: number;
  totalLessons: number;
  skillGrowth: {
    algorithmicThinking: number;
    roboticsHardware: number;
    aiFundamentals: number;
    creativityProblemSolving: number;
    teamCollaboration: number;
  };
  weeklyEngagementHistory: {
    week: string;
    score: number;
    hours: number;
  }[];
  recentAchievements: {
    id: string;
    title: string;
    date: string;
    icon: string;
    description: string;
  }[];
  upcomingMilestone: string;
  mentorFeedback: string;
}

export interface EnrollmentFormData {
  parentName: string;
  studentName: string;
  studentAge: number | string;
  phone: string;
  courseInterest: string;
  preferredMode: 'ananth_nagar_lab' | 'online_interactive';
  preferredTime: string;
  notes?: string;
}
