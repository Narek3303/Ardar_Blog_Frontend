import PropTypes from 'prop-types';
import { Icon } from './Icons'; // Your custom icon component

/**
 * Empty state component for displaying when no content exists
 *
 * @param {Object} props - Component properties
 * @param {string} props.title - Empty state title
 * @param {string} props.description - Empty state description
 * @param {string} props.icon - Icon name to display
 * @param {ReactNode} [props.children] - Additional content
 * @param {string} [props.className] - Additional CSS classes
 */
const EmptyState = ({ title, description, icon, children, className }) => {
    return (
        <div
            className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
            aria-live="polite"
        >
            {icon && (
                <div className="mb-4 p-4 rounded-full bg-gray-100 text-gray-400">
                    <Icon name={icon} className="w-12 h-12" aria-hidden="true" />
                </div>
            )}

            <h3 className="text-xl font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 max-w-md mb-6">{description}</p>

            {children && (
                <div className="mt-4">
                    {children}
                </div>
            )}
        </div>
    );
};

EmptyState.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string
};

EmptyState.defaultProps = {
    icon: null,
    children: null,
    className: ''
};

export default EmptyState;