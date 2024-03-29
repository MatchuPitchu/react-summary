import { CSSProperties, ReactNode } from 'react';
import { interpolate, useVideoConfig, useCurrentFrame } from 'remotion';

type Props = {
	children: ReactNode;
};

export const Title = ({ children }: Props) => {
	const frame = useCurrentFrame();
	const { durationInFrames } = useVideoConfig();

	// V1: animate opacity
	// const opacity = Math.min(1, frame / 60);
	// V2 (recommended): use interpolate with clamp
	const opacity = interpolate(
		frame,
		[0, 30, durationInFrames - 30, durationInFrames], // fade in + fade out
		[0, 1, 1, 0],
		{
			extrapolateRight: 'clamp',
		}
	);

	const style: CSSProperties = {
		fontSize: '2rem',
		color: '#ffffff',
		opacity,
	};

	return <h1 style={style}>{children}</h1>;
};
