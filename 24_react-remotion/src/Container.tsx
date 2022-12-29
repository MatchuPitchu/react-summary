import { CSSProperties, ReactNode } from 'react';

type Props = {
	children: ReactNode;
};

const style: CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
	backgroundColor: '#4a4a4a',
	height: '100%',
	padding: '2rem',
	placeItems: 'center',
	zIndex: -2,
};

export const Container = ({ children }: Props) => {
	return <div style={style}>{children}</div>;
};
