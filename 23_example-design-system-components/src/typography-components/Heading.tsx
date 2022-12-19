import { ReactNode } from 'react';
import { headingLevelToSizeMap, Level } from './style-system';
import { Text } from './Text';

type Props = {
  level: Level;
  children?: ReactNode;
};

export const Heading = ({ level, children }: Props) => {
  return (
    <Text as={`h${level}`} fontSize={headingLevelToSizeMap[level]}>
      {children}
    </Text>
  );
};
