import { IconProps } from ".";

export default function BlogIcon({ size, color }: IconProps) {
  return (
    <svg style={{ width: size ? size : '24px', height: size ? size : '24px' }} viewBox="0 0 24 24">
      <path fill="currentColor" d="M19 5V19H5V5H19M21 3H3V21H21V3M17 17H7V16H17V17M17 15H7V14H17V15M17 12H7V7H17V12Z" />
    </svg>

  );
}