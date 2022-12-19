export const headingLevelToSizeMap = {
  1: 30,
  2: 24,
  3: 20,
  4: 16,
};

export const sizeToFontSizeMap = {
  small: 16,
  medium: 18,
  large: 20,
};

export type Level = keyof typeof headingLevelToSizeMap;
export type Size = keyof typeof sizeToFontSizeMap;
