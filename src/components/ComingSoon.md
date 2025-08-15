# Coming Soon Components Documentation

## Overview
Reusable Coming Soon page components with cute animations, email collection, and dark theme styling.

## Components

### 1. ComingSoon (Full Featured)
Advanced version with Framer Motion animations and interactive elements.

**Features:**
- ✨ Framer Motion animations
- 🎭 Interactive hover effects
- 🌊 Floating background elements
  - 📧 Email collection with loading states
  - 🎉 Success animations
  - ✨ Animated elements without emojis

**Usage:**
```tsx
import ComingSoon from '@/components/ComingSoon';

<ComingSoon
  title="Research Hub"
  subtitle="Deep crypto analysis is coming!"
  description="Building the most comprehensive platform..."
      customMessage="Our team is working around the clock..."
  showEmailInput={true}
/>
```

### 2. ComingSoonLite (Lightweight)
Optimized version using only CSS animations for better performance.

**Features:**
- ⚡ Pure CSS animations
- 📱 Mobile optimized
- 🎨 Gradient backgrounds
- 📧 Email collection
- 🚀 Fast loading

**Usage:**
```tsx
import ComingSoonLite from '@/components/ComingSoonLite';

<ComingSoonLite
  title="Asset Tracker"
  subtitle="Your portfolio companion!"
  showEmailInput={true}
/>
```

### 3. Pre-configured Variants
Ready-to-use components for specific pages.

```tsx
import { ResearchComingSoon, AssetComingSoon } from '@/components/ComingSoonVariants';

// Use directly
<ResearchComingSoon />
<AssetComingSoon />
```

## Props Interface

```tsx
interface ComingSoonProps {
  title?: string;           // Main heading
  subtitle?: string;        // Secondary heading  
  description?: string;     // Default description
  showEmailInput?: boolean; // Show/hide email form
  customMessage?: string;   // Override description
}
```

## Styling

### Colors
- **Background**: Gradient from dark gray to blue
- **Text**: White with gradient accents
- **Accents**: Blue, purple, cyan gradients
- **Success**: Green theme

### Animations
- **Fade In**: Staggered entrance animations
- **Bounce**: Cute emoji movements
- **Pulse**: Breathing effects
- **Gradient**: Animated text colors
- **Hover**: Interactive scaling

## Email Collection

### Form Features
- ✅ Email validation
- ⏳ Loading spinner
- 🎉 Success feedback
- 🚫 Disabled states

### API Integration
Currently simulated with setTimeout. Replace with actual API:

```tsx
const handleEmailSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    await fetch('/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' }
    });
    setIsSubmitted(true);
  } catch (error) {
    // Handle error
  } finally {
    setIsLoading(false);
  }
};
```

## Responsive Design

### Breakpoints
- **Mobile**: Stacked layout, smaller text
- **Tablet**: Medium sizing
- **Desktop**: Full layout with animations

### Logo
- **Size**: 120x120px on all devices
- **Effects**: Glow, hover scaling
- **Position**: Centered above content

## Performance Notes

### ComingSoon (Full)
- Bundle size: ~15KB (with Framer Motion)
- Animations: GPU accelerated
- Best for: Landing pages, important announcements

### ComingSoonLite (Recommended)
- Bundle size: ~3KB
- Animations: CSS-only
- Best for: General coming soon pages

## Customization Examples

### Simple Page
```tsx
<ComingSoonLite
  title="New Feature"
  subtitle="Almost ready!"
  showEmailInput={false}
/>
```

### Marketing Page
```tsx
<ComingSoon
  title="Game Changer"
  subtitle="Revolutionary crypto tool!"
      customMessage="Join 10,000+ users waiting for early access!"
  showEmailInput={true}
/>
```

### Maintenance Page
```tsx
<ComingSoonLite
  title="Under Maintenance"
  subtitle="We'll be back soon!"
  description="Upgrading our systems for better performance."
  showEmailInput={false}
/>
```

## Available Pages

Ready-made configurations:
- Research Hub
- Newsroom+  
- Asset Tracker
- Exchange Hub
- Airdrop Central
- ICO/IDO Launchpad
- Fundraising Platform
- Kamus WEB3
