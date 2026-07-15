import { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
          <p className="text-sm text-white/20 mb-2">Something went wrong</p>
          <p className="text-xs text-white/10 mb-6">An unexpected error occurred.</p>
          <Link
            to="/"
            onClick={() => this.setState({ hasError: false })}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      )
    }
    return this.props.children
  }
}
