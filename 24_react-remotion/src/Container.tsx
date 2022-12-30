import { CSSProperties, ReactNode, FC } from 'react';

type Props = {
	children: ReactNode;
};

const style: CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
	backgroundColor: '#0c1638',
	height: '100%',
	padding: '2rem',
	placeItems: 'center',
	zIndex: -2,
};

export const Container: FC<Props> = ({ children }) => {
	return <div style={style}>{children}</div>;
};
