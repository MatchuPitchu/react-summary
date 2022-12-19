import { ElementType, ReactNode } from 'react';

type Props = {
  as?: ElementType;
  fontSize: number;
  children?: ReactNode;
};

export const Text = ({ as = 'div', fontSize, children }: Props) => {
  const Element = as;

  return <Element style={{ fontSize }}>{children}</Element>;
};
