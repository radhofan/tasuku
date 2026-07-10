import {
  FillButton as GamutFillButton,
  StrokeButton as GamutStrokeButton,
  TextButton as GamutTextButton,
  Alert as GamutAlert,
  Spinner as GamutSpinner,
  Card as GamutCard,
  LayoutGrid as GamutLayoutGrid,
  Column as GamutColumn,
  Text as GamutText,
  Badge as GamutBadge,
  ProgressBar as GamutProgressBar,
  Box as GamutBox,
} from "@codecademy/gamut";
import * as React from "react";

export interface GButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
}

export interface GTextProps {
  variant?:
    | "title-xxl"
    | "title-xl"
    | "title-lg"
    | "title-md"
    | "title-sm"
    | "p-base"
    | "p-small"
    | "span";
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface GCardProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface GBadgeProps {
  className?: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "accent" | "tertiary";
  size?: string;
}

export interface GSpinnerProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface GAlertProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  type?: string;
  onClose?: () => void;
}

export interface GBoxProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const GFillButton =
  GamutFillButton as unknown as React.ComponentType<GButtonProps>;
export const GStrokeButton =
  GamutStrokeButton as unknown as React.ComponentType<GButtonProps>;
export const GTextButton =
  GamutTextButton as unknown as React.ComponentType<GButtonProps>;
export const GAlert = GamutAlert as unknown as React.ComponentType<GAlertProps>;
export const GSpinner =
  GamutSpinner as unknown as React.ComponentType<GSpinnerProps>;
export const GCard = GamutCard as unknown as React.ComponentType<GCardProps>;
export const GText = GamutText as unknown as React.ComponentType<GTextProps>;
export const GBadge = GamutBadge as unknown as React.ComponentType<GBadgeProps>;
export const GBox = GamutBox as unknown as React.ComponentType<GBoxProps>;

export const GLayoutGrid = GamutLayoutGrid as unknown as React.ComponentType<{
  children?: React.ReactNode;
  className?: string;
}>;
export const GColumn = GamutColumn as unknown as React.ComponentType<{
  children?: React.ReactNode;
  size?: number;
  className?: string;
}>;
export const GProgressBar = GamutProgressBar as unknown as React.ComponentType<{
  percent?: number;
  size?: string;
  className?: string;
}>;
