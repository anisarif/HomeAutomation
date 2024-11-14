import React from 'react';
import PropTypes from 'prop-types';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to logging service
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo
        });

        // Here you could send error to logging service
        // logErrorToService(error, errorInfo);
    }

    resetErrorBoundary = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
                    <div className="max-w-lg w-full bg-white rounded-lg shadow-md p-8">
                        <div className="flex flex-col items-center">
                            <h2 className="text-2xl font-bold text-red-600 mb-4">
                                Something went wrong
                            </h2>
                            <p className="text-gray-600 text-center mb-6">
                                {this.state.error?.message || 'An unexpected error occurred'}
                            </p>
                            <button
                                onClick={this.resetErrorBoundary}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                Try again
                            </button>
                            {process.env.NODE_ENV === 'development' && (
                                <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto max-h-48">
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired
};

export default ErrorBoundary; 