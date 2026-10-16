import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { ErrorScreen } from "./ErrorScreen";

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled UI error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorScreen
          title="Something went wrong"
          message="An unexpected error occurred. Reloading usually fixes it."
        >
          <Button onClick={() => window.location.reload()}>Reload page</Button>
        </ErrorScreen>
      );
    }
    return this.props.children;
  }
}