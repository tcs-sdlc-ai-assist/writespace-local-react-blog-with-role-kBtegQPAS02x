import PropTypes from 'prop-types';

const ROLE_CONFIG = {
  admin: {
    emoji: '👑',
    bgClass: 'bg-violet-500',
  },
  user: {
    emoji: '📖',
    bgClass: 'bg-indigo-500',
  },
};

const SIZE_MAP = {
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-14 w-14 text-2xl',
};

export function Avatar({ role = 'user', size = 'md' }) {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.user;
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <div
      className={`${config.bgClass} ${sizeClass} inline-flex items-center justify-center rounded-full text-white select-none shrink-0`}
      role="img"
      aria-label={`${role} avatar`}
    >
      <span>{config.emoji}</span>
    </div>
  );
}

Avatar.propTypes = {
  role: PropTypes.oneOf(['admin', 'user']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default Avatar;