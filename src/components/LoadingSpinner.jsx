import PropTypes from 'prop-types';
import { Spinner } from './Icons'; // Your custom spinner SVG component

/**
 * A customizable loading spinner component
 *
 * @param {Object} props - Component properties
 * @param {boolean} [props.fullScreen=false] - Whether to cover full screen
 * @param {string} [props.size='md'] - Spinner size (sm, md, lg)
 * @param {string} [props.color='primary'] - Spinner color
 * @param {string} [props.className=''] - Additional CSS classes
 */
const LoadingSpinner = ({ fullScreen, size, color, className }) => {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    const colorClasses = {
        primary: 'text-blue-500',
        secondary: 'text-gray-500',
        white: 'text-white'
    };

    return (
        <div
            className={`flex items-center justify-center ${fullScreen ? 'h-screen w-screen' : ''} ${className}`}
            role="status"
            aria-live="polite"
            aria-label="Loading"
        >
            <Spinner
                className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
                aria-hidden="true"
            />
            <span className="sr-only">Loading...</span>
        </div>
    );
};

LoadingSpinner.propTypes = {
    fullScreen: PropTypes.bool,
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    color: PropTypes.oneOf(['primary', 'secondary', 'white']),
    className: PropTypes.string
};

LoadingSpinner.defaultProps = {
    fullScreen: false,
    size: 'md',
    color: 'primary',
    className: ''
};

export default LoadingSpinner;
