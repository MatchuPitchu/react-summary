/*
 All calculations based on this article 👇 ...
 https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/
 which is also available as pdf here:
 /references/Modern Fluid Typography Using CSS Clamp — Smashing Magazine.pdf

 ... or on the excel sheet provided by @vlandow, created by @dheibuelt, which is available here:
 /references/KNW Fonts-and-Spacings.xlsx
 */
import { css } from 'styled-components';
import type { SimpleInterpolation } from 'styled-components';

const settings = {
  base: 0.25,
  font: {
    ratio: 1.25,
    min: 16,
    base: 16,
    max: 18,
    lineHeight: 1.75,
    lineHeightRatio: 1.075,
  },
  screen: {
    maxViewportWidth: 1920,
    minViewportWidth: 480,
  },
};

export const spacingFactors = {
  xxxs: 1,
  xxs: 2,
  xs: 3,
  s: 4,
  m: 6,
  l: 8,
  xl: 10,
  xxl: 12,
  xxxl: 16,
  xxxxl: 24,
};

export type SpacingFactor = keyof typeof spacingFactors;

const preferredSize = (minFontSize: number, maxFontSize: number): string => {
  const { minViewportWidth, maxViewportWidth } = settings.screen;
  const v = (100 * (maxFontSize - minFontSize)) / (maxViewportWidth - minViewportWidth);
  const r = (minViewportWidth * maxFontSize - maxViewportWidth * minFontSize) / (minViewportWidth - maxViewportWidth);

  return `${v.toFixed(2)}vw + ${r / settings.font.base}rem`;
};

export const baseFontSize = `clamp(${settings.font.min}px, ${preferredSize(settings.font.min, settings.font.max)}, ${
  settings.font.max
}px)`;

export const fontSize = (interval: number) => {
  return `${settings.font.ratio ** interval}rem`;
};

export const lineHeight = (interval: number): string => {
  const v = settings.font.lineHeight * settings.font.lineHeightRatio ** interval;
  const a = v - (v % settings.base);
  return `${a}rem`;
};

export const spacing = (factor: SpacingFactor): string => {
  return `${settings.base * spacingFactors[factor]}rem`;
};

export const ms = (interval: number): SimpleInterpolation => {
  return css`
    font-size: ${fontSize(interval)};
    line-height: ${lineHeight(interval)};
  `;
};
