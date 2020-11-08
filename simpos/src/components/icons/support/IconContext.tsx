import React from 'react';

export interface IconContextProps {
  color?: string;
  size?: string;
  className?: string;
  style?: React.CSSProperties;
  attr?: React.SVGAttributes<SVGElement>;
}

export const DefaultContext: IconContextProps = {
  color: undefined,
  size: undefined,
  className: undefined,
  style: undefined,
  attr: undefined,
};

export const IconContext: React.Context<IconContextProps> =
  React.createContext && React.createContext(DefaultContext);
