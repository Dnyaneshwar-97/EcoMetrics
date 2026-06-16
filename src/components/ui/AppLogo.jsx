import { APP_LOGO } from '../../constants/ui';

const SIZE_CLASSES = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-11 h-11 sm:w-12 sm:h-12',
};

const AppLogo = ({ size = 'md', className = '' }) => (
  <img
    src={APP_LOGO}
    alt=""
    className={`object-contain shrink-0 ${SIZE_CLASSES[size] ?? SIZE_CLASSES.md} ${className}`}
    aria-hidden="true"
    decoding="async"
  />
);

export default AppLogo;
