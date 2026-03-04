import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErrorPage } from './ErrorPage'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <ErrorPage
          onTryAgain={this.handleRetry}
          onGoHome={() => {
            this.handleRetry()
            window.location.hash = ''
            window.scrollTo(0, 0)
          }}
        />
      )
    }
    return this.props.children
  }
}
