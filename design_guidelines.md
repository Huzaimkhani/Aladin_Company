# Aladin.AI Design Guidelines

## Design Approach
**Reference-Based Approach: Perplexity AI**
- Clean, minimalist search-first interface
- Dark theme with sophisticated color palette
- Focus on content clarity and information hierarchy
- Smooth, purposeful interactions without excessive animation

## Core Design Principles
1. **Search-First Experience**: Central query input as primary interaction point
2. **Information Clarity**: Financial data must be immediately scannable
3. **Professional Polish**: Sophisticated interface for finance professionals
4. **Purposeful Motion**: Subtle transitions that enhance, not distract

---

## Color Palette

### Dark Mode (Primary)
- **Background**: 18 8% 8% (deep charcoal #121212)
- **Surface**: 252 30% 15% (elevated cards)
- **Primary Brand**: 252 56% 57% (#764ba2 purple)
- **Secondary Brand**: 228 82% 66% (#667eea blue)
- **Accent Gradient**: Linear from #667eea → #764ba2
- **Text Primary**: 0 0% 100% (white)
- **Text Secondary**: 0 0% 70% (gray-300)
- **Success**: 142 76% 36% (green for gains)
- **Danger**: 0 84% 60% (red for losses)
- **Border Subtle**: 0 0% 20% (dividers)

---

## Typography

### Font Families
- **Primary**: 'Inter', -apple-system, system-ui, sans-serif
- **Monospace (data)**: 'JetBrains Mono', 'Courier New', monospace

### Scale
- **Hero Title**: 3rem (48px), font-weight: 700, letter-spacing: -0.02em
- **Page Title**: 2rem (32px), font-weight: 600
- **Section Heading**: 1.5rem (24px), font-weight: 600
- **Body Large**: 1.125rem (18px), font-weight: 400
- **Body**: 1rem (16px), font-weight: 400, line-height: 1.6
- **Small**: 0.875rem (14px), font-weight: 400
- **Micro (labels)**: 0.75rem (12px), font-weight: 500, uppercase, letter-spacing: 0.05em

---

## Layout System

### Spacing Primitives
Use Tailwind units: **2, 4, 6, 8, 12, 16, 20, 24, 32** (e.g., p-4, m-8, gap-6)

### Grid Structure
- **Sidebar**: w-64 (256px) on desktop, collapsible to w-16 icon-only, full overlay on mobile
- **Main Content**: max-w-5xl mx-auto with px-6 padding
- **Multi-column**: 2-3 columns on lg breakpoints, single column on mobile

### Container Patterns
- **Full-width sections**: w-full with max-w-7xl inner container
- **Content sections**: max-w-4xl for readability
- **Forms**: max-w-md centered

---

## Component Library

### Navigation
- **Sidebar**: Fixed left, dark gradient background, hover state with subtle glow
- **Nav Items**: py-3 px-4, rounded-lg, flex items-center gap-3, transition-colors
- **Active State**: bg-purple-900/30 with left border-l-4 border-purple-500

### Cards
- **Base**: rounded-2xl, bg-surface, p-6, border border-subtle, shadow-lg
- **Hover**: scale-[1.02], shadow-2xl, transition duration-200
- **Feature Cards**: Grid layout, icon (40x40) top-left, title + description

### Buttons
- **Primary**: Gradient bg (#667eea → #764ba2), text-white, rounded-lg, px-6 py-3, font-medium
- **Secondary**: border-2 border-purple-500, text-purple-400, bg-transparent
- **Ghost**: text-gray-400, hover:text-white, hover:bg-white/5
- **Over Images**: backdrop-blur-md bg-white/10 border border-white/20

### Forms
- **Input Fields**: bg-surface, border border-gray-700, rounded-lg, px-4 py-3, focus:ring-2 ring-purple-500
- **Labels**: text-sm font-medium text-gray-400, mb-2
- **Search Bar (Hero)**: Oversized (h-16), w-full max-w-3xl, placeholder italic text-gray-500

### Data Tables
- **Structure**: Borderless, hover:bg-white/5 on rows
- **Headers**: Sticky top-0, bg-background/95 backdrop-blur, font-semibold text-xs uppercase
- **Cells**: py-4 px-3, align middle
- **Color Coding**: Green for positive changes, red for negative, monospace font for numbers

### Charts
- **Container**: bg-surface rounded-xl p-6, aspect-video
- **Colors**: Purple/blue gradient fills, white stroke for lines
- **Timeframe Selectors**: Pill buttons (7d/30d/90d/1y) with active state

---

## Key Screens

### 1. Login Page
- **Layout**: Centered form (max-w-md) on gradient background
- **Hero Element**: Large "Aladin.AI" logo (text-5xl) above form
- **Form**: Email/password fields, OAuth buttons (Google/GitHub) with icons, "Sign In" primary button
- **Background**: Full-screen gradient (#667eea → #764ba2) with subtle noise texture

### 2. Home Page (Post-Login)
- **Hero Section**: Central search bar with "Ask Aladin anything finance-related..." placeholder
- **Quick Topics**: 3-column grid of cards (Crypto Trends, Stock Analysis, Forex Rates) with gradient hover
- **Query Counter**: Badge top-right showing "47/100 queries today"
- **No traditional hero image**: Focus on search functionality

### 3. Search Results/Answer Page
- **Query Recap**: Gray box at top with user's question
- **AI Response**: Markdown-styled with inline citations [1], bold key facts, bullet lists
- **Sources**: Numbered list below response with clickable links
- **Charts**: Embedded inline (if relevant), 2-column layout on desktop
- **Paywall Modal**: Blurred overlay + centered card with Stripe checkout or QR code

### 4. Live Data Tables (Crypto/Stocks/Forex)
- **Search Bar**: Top, w-full with fuzzy match indicator
- **Table**: Symbol | Price | 24h Change | Volume | Chart Action
- **Pagination**: Bottom, showing "1-20 of 500"
- **Chart Modal**: Overlay with close button, interactive Recharts visualization

### 5. Payment Plans Page
- **Layout**: 3-column grid (Free/Basic/Premium)
- **Cards**: Equal height, bg-surface with highlighted "Popular" badge on Basic
- **Pricing**: Large text (text-4xl) with /month below, features list with checkmarks
- **CTA Buttons**: Gradient for paid plans, outline for free

### 6. Account/Dashboard
- **Stats Row**: Query usage (circular progress), plan tier, renewal date
- **Search History**: List with timestamps, clickable to re-run, delete icon
- **Settings**: Theme toggle (future), notification preferences

---

## Animations & Interactions
- **Page Transitions**: Fade-in 200ms
- **Card Hover**: scale-[1.02] + shadow elevation
- **Button Hover**: Brightness increase, no color shift on gradient buttons
- **Loading States**: Spinner with "Analyzing market data..." text, skeleton screens for tables
- **Micro-interactions**: Checkmark animation on successful payment, ripple effect on button clicks

---

## Images & Media

### Image Strategy
- **Login Page**: Abstract financial/technology background (blurred gradient, no literal images)
- **No Hero Images**: Aladin.AI is utility-first; search bar IS the hero
- **Feature Icons**: SVG icons (line style) for navigation and features
- **Data Visualizations**: Recharts-generated, not static images
- **Payment QR Codes**: Generated dynamically for Solana/Stripe

### Icon Library
Use Heroicons (outline style) for consistency: search, chart-bar, currency-dollar, user, cog, logout

---

## Accessibility & Performance
- **Contrast Ratios**: All text meets WCAG AA (4.5:1 minimum)
- **Focus States**: ring-2 ring-purple-500 on all interactive elements
- **Keyboard Navigation**: Tab order follows visual hierarchy
- **Loading**: Skeleton screens, lazy-load charts below fold
- **Error States**: Red border + icon + helpful message ("Invalid query. Try 'Bitcoin price'")

---

## Responsiveness
- **Mobile (<768px)**: Sidebar collapses to overlay, single-column layouts, sticky search bar
- **Tablet (768-1024px)**: 2-column grids, sidebar visible
- **Desktop (>1024px)**: Full 3-column layouts, max-w-7xl containers