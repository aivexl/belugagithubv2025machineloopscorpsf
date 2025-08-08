# SubscribeContainer Component

A highly customizable and reusable subscription form component with animated border support.

## Features

- ✅ Fully customizable text and styling
- ✅ Optional animated StarBorder
- ✅ Custom submit handler support
- ✅ Loading states and error handling
- ✅ Responsive design
- ✅ TypeScript support
- ✅ Form validation

## Basic Usage

```jsx
import SubscribeContainer from './SubscribeContainer';

// Default usage
<SubscribeContainer />

// With custom text
<SubscribeContainer 
  title="Get Daily Crypto News"
  buttonText="Join Now"
  placeholder="Your email address"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Subscribe for Crypto Updates"` | The title text |
| `placeholder` | `string` | `"Enter your email"` | Input placeholder text |
| `buttonText` | `string` | `"Subscribe"` | Button text |
| `onSubmit` | `(email: string) => Promise<void> \| void` | `undefined` | Custom submit handler |
| `className` | `string` | `""` | Additional CSS classes for content |
| `showStarBorder` | `boolean` | `true` | Whether to show animated border |
| `starBorderColor` | `string` | `"cyan"` | Border animation color |
| `starBorderSpeed` | `string` | `"6s"` | Border animation speed |
| `starBorderThickness` | `number` | `1` | Border thickness |
| `containerClassName` | `string` | `"w-full max-w-full mt-0 mb-8"` | Container CSS classes |
| `titleClassName` | `string` | `"text-base font-bold mb-3 text-white"` | Title CSS classes |
| `inputClassName` | `string` | `"w-full sm:w-auto flex-1 px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none focus:border-duniacrypto-green text-sm"` | Input CSS classes |
| `buttonClassName` | `string` | `"px-4 py-2 rounded bg-duniacrypto-green text-black font-bold hover:bg-green-400 transition text-sm"` | Button CSS classes |

## Examples

### 1. Default Subscribe
```jsx
<SubscribeContainer />
```

### 2. Custom Text
```jsx
<SubscribeContainer 
  title="Get Daily Crypto News"
  buttonText="Join Now"
  placeholder="Your email address"
/>
```

### 3. Without StarBorder
```jsx
<SubscribeContainer 
  showStarBorder={false}
  title="Simple Newsletter"
  buttonText="Sign Up"
/>
```

### 4. Custom StarBorder
```jsx
<SubscribeContainer 
  starBorderColor="green"
  starBorderSpeed="4s"
  starBorderThickness={2}
  title="Premium Updates"
  buttonText="Upgrade"
/>
```

### 5. With Custom Submit Handler
```jsx
const handleSubmit = async (email) => {
  // Your custom logic here
  await api.subscribe(email);
};

<SubscribeContainer 
  onSubmit={handleSubmit}
  title="Custom Handler"
  buttonText="Submit"
/>
```

### 6. Custom Styling
```jsx
<SubscribeContainer 
  titleClassName="text-xl font-bold mb-4 text-blue-400"
  buttonClassName="px-6 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition text-sm"
  inputClassName="w-full sm:w-auto flex-1 px-4 py-3 rounded-lg bg-gray-800 text-white border border-blue-500 focus:outline-none focus:border-blue-400 text-sm"
  title="Custom Styled"
  buttonText="Join"
/>
```

### 7. Compact Version
```jsx
<SubscribeContainer 
  containerClassName="w-full max-w-md mx-auto"
  titleClassName="text-sm font-semibold mb-2 text-gray-300"
  buttonClassName="px-3 py-1 rounded bg-green-600 text-white font-medium hover:bg-green-700 transition text-xs"
  inputClassName="w-full sm:w-auto flex-1 px-2 py-1 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-green-500 text-xs"
  title="Quick Subscribe"
  buttonText="Go"
  placeholder="Email"
/>
```

## State Management

The component manages its own state for:
- Email input value
- Loading state during submission
- Success/error messages

## Error Handling

- Shows loading state during submission
- Displays success message on successful submission
- Shows error message if submission fails
- Handles both custom and default submit handlers

## Accessibility

- Proper form validation
- Disabled states during submission
- Screen reader friendly
- Keyboard navigation support

## Styling

The component uses Tailwind CSS classes and can be fully customized through props. Default styling follows the Dunia Crypto design system. 