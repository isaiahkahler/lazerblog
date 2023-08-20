import { createContext } from "react";
import { TextStyle } from "react-native";

export const TextContext = createContext<TextStyle | undefined>(undefined);