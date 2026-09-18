import { StudentProgress } from '../types';

export const SAMPLE_STUDENTS: StudentProgress[] = [
  {
    id: 'student-1',
    name: 'Aarav Varma',
    age: 10,
    enrolledCourse: 'Arduino Robotics & IoT Labs (Ages 9-12)',
    level: 'Module 3: Autonomous Sensor Logic',
    joinedDate: 'Jan 2026',
    overallEngagement: 94,
    engagementTrend: 'up',
    weeklyHours: 4.5,
    streakDays: 14,
    completedLessons: 18,
    totalLessons: 24,
    skillGrowth: {
      algorithmicThinking: 92,
      roboticsHardware: 88,
      aiFundamentals: 76,
      creativityProblemSolving: 95,
      teamCollaboration: 89
    },
    weeklyEngagementHistory: [
      { week: 'W1', score: 78, hours: 3.0 },
      { week: 'W2', score: 82, hours: 3.5 },
      { week: 'W3', score: 85, hours: 4.0 },
      { week: 'W4', score: 88, hours: 4.2 },
      { week: 'W5', score: 91, hours: 4.5 },
      { week: 'W6', score: 94, hours: 4.8 }
    ],
    recentAchievements: [
      {
        id: 'ach-1',
        title: 'Obstacle Master',
        date: '3 days ago',
        icon: 'Bot',
        description: 'Successfully programmed ultrasonic distance sensor with 0 collision rate.'
      },
      {
        id: 'ach-2',
        title: 'Circuit Whiz',
        date: '1 week ago',
        icon: 'Zap',
        description: 'Completed multi-LED PWM dimming breadboard circuit in under 15 mins.'
      },
      {
        id: 'ach-3',
        title: 'Logic Ninja',
        date: '2 weeks ago',
        icon: 'Award',
        description: 'Solved 5 complex algorithmic loop puzzles with optimal code efficiency.'
      }
    ],
    upcomingMilestone: 'Capstone Project: Autonomous Maze Solver Presentation at Ananth Nagar Center',
    mentorFeedback: 'Aarav demonstrates exceptional spatial logic! He quickly grasps motor driver pinouts and proactively helps peers during hardware debugging.'
  },
  {
    id: 'student-2',
    name: 'Ananya Rao',
    age: 13,
    enrolledCourse: 'Advanced AI, Neural Nets & Data (Ages 13-16)',
    level: 'Module 4: Computer Vision with OpenCV',
    joinedDate: 'Nov 2025',
    overallEngagement: 97,
    engagementTrend: 'up',
    weeklyHours: 5.2,
    streakDays: 21,
    completedLessons: 26,
    totalLessons: 32,
    skillGrowth: {
      algorithmicThinking: 96,
      roboticsHardware: 80,
      aiFundamentals: 98,
      creativityProblemSolving: 94,
      teamCollaboration: 91
    },
    weeklyEngagementHistory: [
      { week: 'W1', score: 85, hours: 4.0 },
      { week: 'W2', score: 88, hours: 4.5 },
      { week: 'W3', score: 92, hours: 4.8 },
      { week: 'W4', score: 95, hours: 5.0 },
      { week: 'W5', score: 96, hours: 5.1 },
      { week: 'W6', score: 97, hours: 5.2 }
    ],
    recentAchievements: [
      {
        id: 'ach-4',
        title: 'Computer Vision Star',
        date: 'Yesterday',
        icon: 'Brain',
        description: 'Trained a live webcam hand-gesture recognition model with 98.4% validation accuracy.'
      },
      {
        id: 'ach-5',
        title: 'Code Architect',
        date: '10 days ago',
        icon: 'Code2',
        description: 'Built modular Python classes for real-time video processing streams.'
      }
    ],
    upcomingMilestone: 'Deploying custom AI model on Cloud Sandbox',
    mentorFeedback: 'Ananya is an analytical powerhouse. Her mathematical intuition around training loss and learning rate tuning is on par with senior high students.'
  },
  {
    id: 'student-3',
    name: 'Kabir Patel',
    age: 7,
    enrolledCourse: 'Visual Coding & Junior Robotics (Ages 6-8)',
    level: 'Module 2: Interactive Loops & Bot Mazes',
    joinedDate: 'Feb 2026',
    overallEngagement: 91,
    engagementTrend: 'stable',
    weeklyHours: 3.5,
    streakDays: 8,
    completedLessons: 10,
    totalLessons: 16,
    skillGrowth: {
      algorithmicThinking: 88,
      roboticsHardware: 85,
      aiFundamentals: 70,
      creativityProblemSolving: 92,
      teamCollaboration: 86
    },
    weeklyEngagementHistory: [
      { week: 'W1', score: 80, hours: 2.5 },
      { week: 'W2', score: 84, hours: 3.0 },
      { week: 'W3', score: 89, hours: 3.2 },
      { week: 'W4', score: 90, hours: 3.5 },
      { week: 'W5', score: 91, hours: 3.5 },
      { week: 'W6', score: 91, hours: 3.5 }
    ],
    recentAchievements: [
      {
        id: 'ach-6',
        title: 'Storyteller Prodigy',
        date: '4 days ago',
        icon: 'Sparkles',
        description: 'Created a multi-character interactive space adventure story using Scratch.'
      }
    ],
    upcomingMilestone: 'Building a Lego Gear Car that climbs a 20-degree incline',
    mentorFeedback: 'Kabir has boundless enthusiasm! He loves experimenting with robot sound buzzers and always asks how real space rovers communicate.'
  }
];
