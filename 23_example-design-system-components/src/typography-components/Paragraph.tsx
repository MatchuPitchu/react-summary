import { ReactNode } from 'react';
import { Size, sizeToFontSizeMap } from './style-system';
import { Text } from './Text';

type Props = {
  size: Size;
  children?: ReactNode;
};

export const Paragraph = ({ size, children }: Props) => {
  return (
    <Text as='p' fontSize={sizeToFontSizeMap[size]}>
      {children}
    </Text>
  );
};
