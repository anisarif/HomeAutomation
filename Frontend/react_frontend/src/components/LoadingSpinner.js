// components/LoadingSpinner.js
import React, { memo } from 'react';
import PropTypes from 'prop-types';

export const LoadingSpinner = memo(({ size = 'medium', color = 'white' }) => {
    const sizeClasses = {
        small: 'h-6 w-6',
        medium: 'h-12 w-12',
        large: 'h-16 w-16'
    };

    const colorClasses = {
        white: 'border-white',
        blue: 'border-blue-500',
        gray: 'border-gray-300'
    };

    return (
        <div 
            role="status"
            aria-label="Loading"
            className="flex items-center justify-center"
        >
            <div 
                className={`
                    animate-spin rounded-full
                    border-t-transparent border-4
                    ${sizeClasses[size]}
                    ${colorClasses[color]}
                `}
            />
            <span className="sr-only">Loading...</span>
        </div>
    );
});

LoadingSpinner.propTypes = {
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    color: PropTypes.oneOf(['white', 'blue', 'gray'])
};

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;