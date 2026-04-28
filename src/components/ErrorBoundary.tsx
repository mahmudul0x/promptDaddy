import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props { children: ReactNode }
interface State { hasError: boolean; error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-destructive/10 border border-destructive/20 mb-6">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">Something went wrong</h1>
          <p className="text-sm text-muted-foreground mb-1 line-clamp-3">
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </p>
          <p className="text-xs text-muted-foreground/60 mb-6">
            Reload the page to try again. If the issue persists, contact support.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-primary-foreground hover:opacity-90 transition-opacity"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <RefreshCw className="h-4 w-4" />
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
