import { CSSProperties, ReactNode } from 'react';
import { spring, useVideoConfig, useCurrentFrame } from 'remotion';

type Props = {
	children: ReactNode;
};

export const Paragraph = ({ children }: Props) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const scale = spring({
		fps,
		frame,
	});

	const style: CSSProperties = {
		color: '#ffffff',
		transform: `scale(${scale})`,
	};

	return <p style={style}>{children}</p>;
};
