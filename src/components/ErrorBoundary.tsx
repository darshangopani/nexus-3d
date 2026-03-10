import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020813] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl max-w-2xl">
            <h1 className="text-3xl font-bold text-red-400 mb-4">Something went wrong</h1>
            <p className="text-gray-300 mb-6">
              An unexpected error occurred in the application.
            </p>
            <div className="bg-black/50 p-4 rounded-xl text-left overflow-auto max-h-64 text-sm text-gray-400 font-mono">
              {this.state.error?.message}
            </div>
            <button
              className="mt-8 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              onClick={() => window.location.reload()}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
