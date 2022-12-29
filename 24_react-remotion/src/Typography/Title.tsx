import { CSSProperties, ReactNode } from 'react';
import { interpolate } from 'remotion';
import { useCurrentFrame } from 'remotion';

type Props = {
	children: ReactNode;
};

export const Title = ({ children }: Props) => {
	const frame = useCurrentFrame();

	// V1: animate opacity
	// const opacity = Math.min(1, frame / 60);
	// V2 (recommended): use interpolate with clamp
	const opacity = interpolate(frame, [0, 30], [0, 1], {
		extrapolateRight: 'clamp',
	});

	const style: CSSProperties = {
		fontSize: '2rem',
		color: '#ffffff',
		opacity,
	};

	return <h1 style={style}>{children}</h1>;
};
