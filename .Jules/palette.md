## 2024-05-23 - Accessibility of Icon-Only Links
**Learning:** Icon-only links often rely on `title` attributes for tooltips, but this is insufficient for screen readers and touch devices.
**Action:** Always add `aria-label` to icon-only buttons or links to ensure they have an accessible name. Hide the decorative icon with `aria-hidden="true"`.
