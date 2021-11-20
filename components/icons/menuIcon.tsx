import { IconProps } from '.'

export default function MenuIcon({ size, color }: IconProps) {
  return (
    <svg
      style={{ width: size ? size : '24px', height: size ? size : '24px' }}
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"
      />
    </svg>
  )
}
