import PropTypes from 'prop-types';
import { IconAlert } from './Icons'; // Your custom alert icon component

/**
 * Displays error messages with consistent styling
 *
 * @param {Object} props - Component properties
 * @param {string} props.message - Error message to display
 * @param {boolean} [props.fullScreen=false] - Whether to cover full screen
 * @param {string} [props.variant='error'] - Variant type (error, warning, info)
 * @param {function} [props.onRetry] - Retry callback function
 * @param {string} [props.className] - Additional CSS classes
 */
const ErrorMessage = ({ message, fullScreen, variant, onRetry, className }) => {
    const variantClasses = {
        error: 'bg-red-50 text-red-700',
        warning: 'bg-yellow-50 text-yellow-700',
        info: 'bg-blue-50 text-blue-700'
    };

    return (
        <div
            className={`flex flex-col items-center justify-center p-6 rounded-lg ${variantClasses[variant]} ${
                fullScreen ? 'min-h-screen' : ''
            } ${className}`}
            role="alert"
            aria-live="assertive"
        >
            <div className="flex items-center mb-4">
                <IconAlert className={`w-6 h-6 mr-2 ${
                    variant === 'error' ? 'text-red-500' :
                        variant === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                }`} />
                <h3 className="text-lg font-medium">
                    {variant === 'error' ? 'Error' :
                        variant === 'warning' ? 'Warning' : 'Notice'}
                </h3>
            </div>

            <p className="mb-4 text-center">{message}</p>

            {onRetry && (
                <button
                    onClick={onRetry}
                    className={`px-4 py-2 rounded-md ${
                        variant === 'error' ? 'bg-red-100 hover:bg-red-200' :
                            variant === 'warning' ? 'bg-yellow-100 hover:bg-yellow-200' :
                                'bg-blue-100 hover:bg-blue-200'
                    } transition-colors`}
                    aria-label="Retry"
                >
                    Try Again
                </button>
            )}
        </div>
    );
};

ErrorMessage.propTypes = {
    message: PropTypes.string.isRequired,
    fullScreen: PropTypes.bool,
    variant: PropTypes.oneOf(['error', 'warning', 'info']),
    onRetry: PropTypes.func,
    className: PropTypes.string
};

ErrorMessage.defaultProps = {
    fullScreen: false,
    variant: 'error',
    onRetry: null,
    className: ''
};

export default ErrorMessage;
