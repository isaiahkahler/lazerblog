import { IconProps } from ".";

export default function CheckIcon({ size, color }: IconProps) {
  return (
    <svg style={{ width: size ? size : '24px', height: size ? size : '24px' }} viewBox="0 0 24 24">
      {/* <path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" /> */}\
    <path fill="currentColor" d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
    </svg>

  );
}