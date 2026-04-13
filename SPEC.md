# Fynex 2.0 - Learning Platform Specification

## 1. Concept & Vision

**Fynex** — bu yosh o'quvchilar va dasturchilar uchun mo'ljallangan bepul ta'lim platformasi. Platforma o'ziga xos chiroyli, iOS uslubidagi shaffof dizayn bilan ajralib turadi. Minimalistik lekin emotsional — har bir animatsiya foydalanuvchini rag'batlantiradi. Telegram Mini App va web brauzerda ishlaydi.

**Maqsad:** Ingiliz tili, Rus tili, Matematika, Fizika va boshqa fanlarni bepul o'rganish.

## 2. Design Language

### Aesthetic Direction
- iOS-inspired glassmorphism with frosted glass effects
- Soft gradients, rounded corners, subtle shadows
- Minimalist iconography (Lucide React icons)
- Smooth micro-animations

### Color Palette
- **Primary:** #6366F1 (Indigo)
- **Secondary:** #8B5CF6 (Violet)
- **Accent:** #F59E0B (Amber - for achievements/coins)
- **Success:** #10B981 (Emerald)
- **Background:** #F8FAFC (Light) with glass overlay
- **Text Primary:** #1E293B
- **Text Secondary:** #64748B
- **Glass:** rgba(255, 255, 255, 0.7) with backdrop-blur

### Typography
- **Primary Font:** Inter (Google Fonts)
- **Headings:** Inter Bold, 24-32px
- **Body:** Inter Regular, 14-16px
- **Captions:** Inter Medium, 12px

### Spatial System
- Base unit: 4px
- Card padding: 16-20px
- Section gaps: 24px
- Border radius: 16px (cards), 12px (buttons), 24px (large elements)

### Motion Philosophy
- Page transitions: slide + fade, 300ms ease-out
- Button press: scale(0.97), 100ms
- Card hover: translateY(-2px) + shadow increase, 200ms
- Stagger animations for lists: 50ms delay between items
- Skeleton loading animations
- Success celebrations: confetti burst

## 3. Layout & Structure

### App Shell (Bottom Navigation)
- iOS-style bottom tab bar with glass effect
- 4 main sections: Home, Courses, Leaderboard, Profile
- Active state with filled icon + label
- Smooth icon morphing on tab change

### Page Structure
1. **Home** - Welcome message, Daily streak, Quick stats, Featured courses
2. **Courses** - Categories grid, Course cards with progress
3. **Leaderboard** - Top learners, User rank, Weekly/Monthly toggle
4. **Profile** - Avatar, Stats, Pro subscription card, Settings

### Responsive Strategy
- Mobile-first (320px-428px optimal)
- Max-width: 428px centered on larger screens
- Safe areas for notch devices

## 4. Features & Interactions

### Authentication
- Phone number input (+998 format)
- OTP verification (6 digits, auto-focus next input)
- Guest mode available
- LocalStorage persistence

### Home Screen
- Greeting with time-based message ("Good morning, [Name]")
- Daily streak tracker with flame animation
- XP progress bar
- "Continue Learning" section with last course
- Daily challenge card

### Courses Section
- Category filters: All, English, Russian, Math, Physics, Programming
- Course cards with:
  - Thumbnail icon
  - Title & description
  - Progress ring (0-100%)
  - Lesson count
  - Lock icon for Pro courses (if not subscribed)
- Tap → Course detail modal

### Course Detail Modal
- Hero section with blur background
- Course info (title, description, lessons)
- Progress indicator
- "Start Lesson" button
- Pro badge for locked content

### Leaderboard
- Top 3 with crown/medal icons (animated)
- User's current rank highlighted
- Time filter: This Week / This Month / All Time
- XP and streak stats visible
- Pull-to-refresh animation

### Profile Screen
- Avatar with edit option
- User stats: Total XP, Courses completed, Streak days
- Pro subscription card:
  - Current status (Free/Pro)
  - Pro benefits list
  - "Upgrade for 9,999 UZS" CTA
- Settings list:
  - Notifications toggle
  - Language selector
  - About
  - Logout

### Pro Subscription (Fynex 2.0)
- Price: 9,999 UZS/month
- Benefits:
  - All courses unlocked
  - No ads
  - Exclusive Pro courses
  - Priority support
  - Offline downloads (future)
- Payment via click (demo)

### Animations
- Splash screen: Logo fade-in, 1.5s
- Tab switch: Content slide + icon morph
- Card press: Ripple effect
- Success: Checkmark animation
- XP gain: Floating "+XP" text
- Streak: Flame flicker
- Leaderboard rank change: Slide animation

## 5. Component Inventory

### BottomNav
- Glass background with blur
- 4 icon tabs
- Active: filled icon + label + indicator dot
- Hover: icon scale 1.1

### CourseCard
- States: Default, Hover, Locked (Pro), Completed
- Glass card with shadow
- Progress ring overlay
- Lock icon badge for Pro

### Button
- Variants: Primary, Secondary, Ghost
- States: Default, Hover, Active, Disabled, Loading
- Loading: spinner icon
- Press: scale down animation

### Input (Phone/OTP)
- Floating label
- Focus ring animation
- Error state with shake
- Success checkmark

### Modal
- Backdrop blur
- Slide up animation
- Drag handle indicator
- Close on swipe down

### StatCard
- Icon + value + label
- Subtle gradient background
- Hover lift effect

### Avatar
- Circular with gradient border
- Initials fallback
- Online dot indicator (optional)

### ProBadge
- Gradient background (gold)
- Crown icon
- Glow effect

### LeaderboardRow
- Rank number with medal for top 3
- Avatar + name
- XP count
- Highlight for user's row

## 6. Technical Approach

### Framework
- React 18 + TypeScript
- Vite build tool
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for icons

### State Management
- React useState/useReducer for local state
- Context API for global state (user, theme)
- LocalStorage for persistence

### Data Model
```typescript
interface User {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  xp: number;
  streak: number;
  completedCourses: string[];
  isPro: boolean;
  createdAt: Date;
}

interface Course {
  id: string;
  title: string;
  description: string;
  category: 'english' | 'russian' | 'math' | 'physics' | 'programming';
  icon: string;
  lessons: Lesson[];
  isPro: boolean;
  totalXp: number;
}

interface Lesson {
  id: string;
  title: string;
  duration: number;
  completed: boolean;
}

interface LeaderboardEntry {
  rank: number;
  user: User;
  xp: number;
  streak: number;
}
```

### Telegram Mini App Integration
- Telegram Web App API usage
- Ready event for theme sync
- BackButton handling
- Biometric authentication (if available)

### Add to Home Screen
- Manifest.json with icons
- iOS meta tags for add-to-homescreen
- Android intent handling
