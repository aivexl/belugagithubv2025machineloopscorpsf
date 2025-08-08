import React from 'react';

declare class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode });
  static getDerivedStateFromError(error: Error): { hasError: true; error: Error };
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void;
  render(): React.ReactNode;
}

export default ErrorBoundary; 