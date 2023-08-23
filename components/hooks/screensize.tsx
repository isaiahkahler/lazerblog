import { useContext } from "react";
import { ScreenSizeContext, ScreenSizeToNumber } from "../data/constants";

export function useIsExtraSmallScreenSize() {
  const screenSizeContext = useContext(ScreenSizeContext);
  const isExtraLargeDisplay = screenSizeContext && screenSizeContext.sizeNumber >= ScreenSizeToNumber['xs'];
  return isExtraLargeDisplay;
}
export function useIsSmallScreenSize() {
  const screenSizeContext = useContext(ScreenSizeContext);
  const isExtraLargeDisplay = screenSizeContext && screenSizeContext.sizeNumber >= ScreenSizeToNumber['sm'];
  return isExtraLargeDisplay;
}
export function useIsMediumScreenSize() {
  const screenSizeContext = useContext(ScreenSizeContext);
  const isExtraLargeDisplay = screenSizeContext && screenSizeContext.sizeNumber >= ScreenSizeToNumber['md'];
  return isExtraLargeDisplay;
}
export function useIsLargeScreenSize() {
  const screenSizeContext = useContext(ScreenSizeContext);
  const isExtraLargeDisplay = screenSizeContext && screenSizeContext.sizeNumber >= ScreenSizeToNumber['lg'];
  return isExtraLargeDisplay;
}
export function useIsExtraLargeScreenSize() {
  const screenSizeContext = useContext(ScreenSizeContext);
  const isExtraLargeDisplay = screenSizeContext && screenSizeContext.sizeNumber >= ScreenSizeToNumber['xl'];
  return isExtraLargeDisplay;
}