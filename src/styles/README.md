# Custom Scrollbar Documentation

## Global Scrollbar Styling

All elements now have custom dark theme scrollbar by default via global CSS in `globals.css`.

## Utility Classes

### Available Classes:
- `scrollbar-default` - Standard 6px thin scrollbar (gray theme)
- `custom-scrollbar-thin` - Extra thin 4px scrollbar for tight spaces  
- `scrollbar-hidden` - Hide scrollbar completely

### Usage Examples:

```jsx
// Default thin scrollbar
<div className="overflow-y-auto scrollbar-default">
  Content here...
</div>

// Extra thin for sidebars/modals
<div className="overflow-y-auto custom-scrollbar-thin">
  Sidebar content...
</div>

// Hidden scrollbar
<div className="overflow-y-auto scrollbar-hidden">
  Clean content without visible scrollbar...
</div>
```

## CSS-in-JS Usage

Import the utility for dynamic styling:

```jsx
import { scrollbarStyles, scrollbarClasses } from '@/components/ScrollbarStyles';

// Use with styled components or inline styles
const StyledDiv = styled.div`
  ${scrollbarStyles.webkit}
`;

// Use classes
<div className={scrollbarClasses.thin}>
```

## Color Theme

- **Track**: `#1f2937` (Dark gray)
- **Thumb**: `#374151` (Medium gray)  
- **Thumb Hover**: `#4b5563` (Light gray)
- **Thumb Active**: `#6b7280` (Lightest gray)

## Browser Support

- ✅ Chrome/Safari/Edge (Webkit)
- ✅ Firefox (scrollbar-width + scrollbar-color)
- ✅ All modern browsers

## Global Behavior

- All scrollbars are thin by default
- Dark theme matching the app design
- Smooth scrolling enabled globally
- Hover effects for better UX
