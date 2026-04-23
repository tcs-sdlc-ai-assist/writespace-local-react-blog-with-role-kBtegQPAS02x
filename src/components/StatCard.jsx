import React from 'react';
import PropTypes from 'prop-types';

export function StatCard({ label, value, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
    gray: 'bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400',
  };

  const borderColorClasses = {
    blue: 'border-blue-200 dark:border-blue-800',
    green: 'border-green-200 dark:border-green-800',
    purple: 'border-purple-200 dark:border-purple-800',
    red: 'border-red-200 dark:border-red-800',
    orange: 'border-orange-200 dark:border-orange-800',
    indigo: 'border-indigo-200 dark:border-indigo-800',
    gray: 'border-gray-200 dark:border-gray-800',
  };

  const resolvedColor = color || 'blue';
  const iconBgClass = colorClasses[resolvedColor] || colorClasses.blue;
  const borderClass = borderColorClasses[resolvedColor] || borderColorClasses.blue;

  const formattedValue = typeof value === 'number'
    ? value.toLocaleString()
    : value;

  return (
    <div
      className={`rounded-lg border ${borderClass} bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {formattedValue}
          </p>
        </div>
        {icon && (
          <div
            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${iconBgClass}`}
          >
            <span className="text-xl">{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  icon: PropTypes.node,
  color: PropTypes.oneOf(['blue', 'green', 'purple', 'red', 'orange', 'indigo', 'gray']),
};

StatCard.defaultProps = {
  icon: null,
  color: 'blue',
};