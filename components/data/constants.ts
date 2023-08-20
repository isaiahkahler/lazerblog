import { createContext } from "react";

export const BACKGROUND_COLOR = '#fafafa';
export const TEXT_COLOR = '#0a0a0a';

export const ACCENT_COLOR = '#6173fb';
export const ACCENT_COLOR_LIGHT = '#818ffc';
export const ACCENT_COLOR_DARK = '#5768e2';

export const ACCENT_TEXT_COLOR = '#fafafa';
export const ACTION_COLOR = '#ebebeb';
export const ACTION_COLOR_LIGHT = '#ffffff';
export const ACTION_COLOR_DARK = '#a5a5a5';

export const REM = 16;


// React Variables
export const ScreenSizeContext = createContext<[string, number] | undefined>(undefined);


const tintColorDark = '#fff';

export default {
  light: {
    text: TEXT_COLOR,
    background: BACKGROUND_COLOR,
    tint: ACCENT_COLOR,
    tabIconDefault: '#ccc',
    tabIconSelected: ACCENT_COLOR,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: ACCENT_COLOR,
    tabIconDefault: '#ccc',
    tabIconSelected: '#fff',
  },
};
