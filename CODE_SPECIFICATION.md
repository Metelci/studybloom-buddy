# StudyPlan YDS Exam Tracker - Code Specification

## 📱 Project Overview

**App Name:** StudyPlan — YDS Exam Tracker  
**Type:** Gamified AI-Assisted Exam Preparation App  
**Target Users:** Turkish Students preparing for YDS Exam  
**Tech Stack:** React + TypeScript + Vite + Tailwind CSS + Material Design 3

---

## 🎨 Design System

### Color Palette (HSL Values)
```css
/* Primary Colors */
--primary: 199 92% 73%;           /* #81D4FA - Light Blue */
--primary-container: 199 70% 85%; /* #B3E5FC - Light Blue Container */
--primary-container-foreground: 199 100% 20%;

/* Secondary Colors */  
--secondary: 122 39% 69%;         /* #A5D6A7 - Light Green */
--secondary-container: 122 39% 82%; /* #C8E6C9 - Light Green Container */
--secondary-container-foreground: 122 100% 15%;

/* Tertiary Colors */
--tertiary: 14 100% 78%;          /* #FFAB91 - Soft Coral */
--tertiary-container: 14 100% 88%;
--tertiary-container-foreground: 14 100% 25%;

/* Surface System */
--background: 0 0% 98%;           /* #FAFAFA */
--surface: 0 0% 100%;
--surface-variant: 0 0% 96%;
--surface-container: 0 0% 94%;
--surface-container-high: 0 0% 92%;

/* Text Colors */
--on-surface: 0 0% 13%;           /* #212121 */
--on-surface-variant: 0 0% 46%;
--outline: 0 0% 73%;
--outline-variant: 0 0% 89%;

/* Semantic Colors */
--success: 122 39% 49%;           /* Success Green */
--success-container: 122 39% 82%;
--warning: 45 100% 51%;           /* Warning Orange */
--error: 0 65% 51%;               /* Error Red */

/* Gamification Colors */
--streak-fire: 14 100% 57%;       /* Fire Orange #FF6D00 */
--achievement-bronze: 30 67% 47%; /* Bronze #B8860B */
--achievement-silver: 0 0% 75%;   /* Silver #C0C0C0 */
--achievement-gold: 51 100% 50%;  /* Gold #FFD700 */
--achievement-platinum: 240 12% 85%; /* Platinum #E5E4E2 */
```

### Typography Scale
```css
/* Font Families */
font-family: 'Google Sans Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
font-family: 'Roboto Flex', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Type Scale */
--text-display-large: 57px/64px;   /* Headlines */
--text-display-medium: 45px/52px;
--text-display-small: 36px/44px;

--text-headline-large: 32px/40px;   /* Section headers */
--text-headline-medium: 28px/36px;
--text-headline-small: 24px/32px;

--text-title-large: 22px/28px;      /* Card titles */
--text-title-medium: 16px/24px;
--text-title-small: 14px/20px;

--text-body-large: 16px/24px;       /* Body text */
--text-body-medium: 14px/20px;
--text-body-small: 12px/16px;

--text-label-large: 14px/20px;      /* Button labels */
--text-label-medium: 12px/16px;
--text-label-small: 11px/16px;
```

### Spacing System (4dp Grid)
```css
--spacing-0: 0px;
--spacing-1: 4px;      /* 0.25rem */
--spacing-2: 8px;      /* 0.5rem */
--spacing-3: 12px;     /* 0.75rem */
--spacing-4: 16px;     /* 1rem */
--spacing-6: 24px;     /* 1.5rem */
--spacing-8: 32px;     /* 2rem */
--spacing-12: 48px;    /* 3rem */
--spacing-16: 64px;    /* 4rem */
--spacing-20: 80px;    /* 5rem */
```

### Border Radius
```css
--radius: 12px;        /* Default card radius */
--radius-sm: 8px;      /* Small elements */
--radius-md: 10px;     /* Medium elements */
--radius-lg: 24px;     /* FAB, large buttons */
--radius-xl: 32px;     /* Hero elements */
```

### Shadows (Material Design 3)
```css
--shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
```

### Animation Tokens
```css
--transition-fast: 100ms;
--transition-standard: 200ms;
--transition-emphasized: 400ms;

/* Easing Functions */
--ease-standard: cubic-bezier(0.2, 0.0, 0, 1.0);
--ease-emphasized: cubic-bezier(0.05, 0.7, 0.1, 1.0);
--ease-decelerated: cubic-bezier(0.3, 0.0, 0.8, 0.15);
--ease-accelerated: cubic-bezier(0.4, 0.0, 1, 1);
```

---

## 🏗️ Architecture

### File Structure
```
src/
├── components/
│   ├── ui/                    # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── switch.tsx
│   │   └── ...
│   ├── Navigation.tsx         # Bottom navigation
│   ├── Home.tsx              # Home dashboard
│   ├── Settings.tsx          # Settings page
│   ├── ProgressRing.tsx      # Circular progress
│   ├── StreakCounter.tsx     # Streak display
│   ├── TaskCard.tsx          # Task item
│   └── ExamCountdown.tsx     # Countdown timer
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/
│   └── utils.ts              # Utility functions
├── pages/
│   ├── Index.tsx
│   └── NotFound.tsx
├── App.tsx                   # Main app component
├── main.tsx                  # Entry point
└── index.css                 # Global styles
```

### State Management
- **Local State:** React useState for component-level state
- **Navigation:** Simple string-based active tab state
- **Settings:** Local state object with persistence capability
- **No external state management** (Redux, Zustand) - kept simple

---

## 🎮 Gamification System

### Points & Scoring
```typescript
interface PointSystem {
  taskCompletion: 10;           // Base points per task
  streakMultiplier: number;     // 1x, 2x, 3x, etc.
  perfectDay: 50;               // Bonus for 100% completion
  weeklyGoal: 200;              // Weekly milestone bonus
}
```

### Achievement Tiers
```typescript
type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum';

interface Achievement {
  id: string;
  title: string;
  description: string;
  tier: AchievementTier;
  points: number;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}
```

### Streak System
```typescript
interface StreakData {
  current: number;              // Current streak count
  longest: number;              // Personal best
  lastStudyDate: Date;
  isAtRisk: boolean;            // True if >20 hours since last study
  fireEffect: boolean;          // Show fire animation (streak >= 7)
}
```

---

## 🎯 Component Specifications

### Navigation Component
```typescript
interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// Tab Configuration
const navigationItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "progress", label: "Progress", icon: TrendingUp },
  { id: "social", label: "Social", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];
```

### ProgressRing Component
```typescript
interface ProgressRingProps {
  progress: number;             // 0-100
  size?: number;               // Diameter in px
  strokeWidth?: number;        // Ring thickness
  showAnimation?: boolean;     // Enable completion animation
  celebrateAt?: number;        // Trigger celebration (default: 100)
}
```

### TaskCard Component
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  type: 'grammar' | 'reading' | 'listening' | 'vocabulary';
  points: number;
  completed: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;       // Minutes
  dueDate?: Date;
}

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onSwipeComplete: (taskId: string) => void;
}
```

### StreakCounter Component
```typescript
interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  showFireEffect: boolean;
  isAtRisk: boolean;
}
```

---

## 🎨 Animation Specifications

### Micro-Interactions
```css
/* Button Press */
.button-press {
  transform: scale(0.95);
  transition: transform 100ms ease-out;
}

/* Card Hover */
.card-hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  transition: all 200ms ease-standard;
}

/* Completion Celebration */
@keyframes celebration-bounce {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.celebrate {
  animation: celebration-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Fire Effect (Streak) */
@keyframes fire-flicker {
  0%, 100% { 
    transform: scale(1) rotate(-1deg);
    filter: hue-rotate(0deg);
  }
  25% { 
    transform: scale(1.05) rotate(1deg);
    filter: hue-rotate(10deg);
  }
  75% { 
    transform: scale(0.95) rotate(-0.5deg);
    filter: hue-rotate(-10deg);
  }
}

.fire-effect {
  animation: fire-flicker 2s ease-in-out infinite;
}

/* Breathing Animation (Idle states) */
@keyframes breathing {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.005); }
}

.breathing {
  animation: breathing 2s ease-in-out infinite;
}
```

### Page Transitions
```typescript
// Navigation transition timing
const NAVIGATION_TIMING = {
  duration: 200,
  easing: 'ease-standard'
};

// Modal/Dialog animations
const MODAL_TIMING = {
  enter: 300,
  exit: 200,
  easing: 'ease-emphasized'
};
```

---

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
@media (min-width: 375px) { /* iPhone SE */ }
@media (min-width: 390px) { /* iPhone 12 Pro */ }
@media (min-width: 428px) { /* iPhone 12 Pro Max */ }
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
```

### Container Constraints
```css
.app-container {
  max-width: 428px;          /* Max mobile width */
  margin: 0 auto;
  padding: 0 16px;
}

.navigation-height {
  padding-bottom: 80px;      /* Account for fixed bottom nav */
}
```

---

## 🔧 Technical Implementation

### Performance Optimizations
- **Lazy Loading:** Dynamic imports for non-critical components
- **Image Optimization:** WebP format with fallbacks
- **Bundle Splitting:** Separate vendor and app bundles
- **Tree Shaking:** Remove unused code via ES modules

### Accessibility Features
```typescript
// ARIA Labels
const a11yLabels = {
  navigation: "Main navigation",
  progressRing: "Study progress: {percentage}% complete",
  taskComplete: "Mark task as complete",
  streakCounter: "Current study streak: {days} days"
};

// Keyboard Navigation
const keyboardShortcuts = {
  'Space': 'Toggle task completion',
  'Enter': 'Open task details',
  'Escape': 'Close modal/dialog'
};

// Reduced Motion Support
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Data Persistence
```typescript
// LocalStorage Schema
interface AppData {
  user: {
    streak: StreakData;
    achievements: Achievement[];
    settings: UserSettings;
  };
  tasks: Task[];
  progress: {
    dailyStats: Record<string, number>;
    weeklyGoals: Record<string, number>;
  };
}
```

---

## 🚀 Build & Deployment

### Build Configuration
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx"
  }
}
```

### Environment Variables
```env
VITE_APP_NAME=StudyPlan YDS Tracker
VITE_APP_VERSION=1.0.0
VITE_API_URL=https://api.studyplan.app
```

### Bundle Analysis
- **Target Size:** < 500KB gzipped
- **Critical Path:** < 100KB initial load
- **Lighthouse Score:** > 90 Performance, Accessibility, Best Practices

---

## 📚 Dependencies

### Core Dependencies
```json
{
  "@tanstack/react-query": "^5.83.0",
  "@radix-ui/react-*": "Latest",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "date-fns": "^3.6.0",
  "lucide-react": "^0.462.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.30.1",
  "tailwind-merge": "^2.6.0",
  "tailwindcss-animate": "^1.0.7"
}
```

### Dev Dependencies
```json
{
  "@types/react": "^18.3.1",
  "@types/react-dom": "^18.3.1",
  "@vitejs/plugin-react": "^4.3.4",
  "autoprefixer": "^10.4.20",
  "eslint": "^9.16.0",
  "postcss": "^8.5.0",
  "tailwindcss": "^3.4.17",
  "typescript": "^5.7.2",
  "vite": "^6.0.3"
}
```

---

## 🎯 Future Enhancements

### Planned Features
1. **Offline Support:** PWA with service worker
2. **Push Notifications:** Web Push API integration  
3. **Data Sync:** Cloud storage for cross-device sync
4. **Advanced Analytics:** Detailed progress tracking
5. **Social Features:** Study groups and leaderboards
6. **AI Integration:** Smart study recommendations

### Performance Goals
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **First Input Delay:** < 100ms

---

*Generated on: $(date)*  
*Version: 1.0.0*  
*Last Updated: December 2024*