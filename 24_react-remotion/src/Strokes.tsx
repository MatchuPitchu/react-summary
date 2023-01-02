import { FC, useRef } from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import styles from './Strokes.module.css';

export const Strokes: FC = () => {
	const frame = useCurrentFrame();
	const { durationInFrames } = useVideoConfig();
	const svgElement = useRef<SVGSVGElement>(null);
	const stroke = useRef<SVGPathElement>(null);
	const strokeLength = stroke.current?.getTotalLength() || 2;

	const opacity = interpolate(
		frame,
		[0, 60, durationInFrames - 30, durationInFrames],
		[0, 1, 1, 0],
		{
			extrapolateRight: 'clamp', // if frame becomes > 60 output range would be > 1, so need to clamp range at 1
		}
	);

	const strokeDasharray = `${strokeLength * 0.2} ${strokeLength * 0.8}`;

	const strokeDashoffset = interpolate(
		frame,
		[0, durationInFrames],
		[0, strokeLength]
	);

	return (
		<svg
			ref={svgElement}
			className={styles['strokes-container']}
			viewBox="0 0 1 1"
			style={{ opacity }}
		>
			<path
				ref={stroke}
				d="M0.3,0.5a0.2,0.45 0 1,0 0.4,0a0.2,0.45 0 1,0 -0.4,0"
				className={`${styles['stroke-path']} ${styles['stroke-path--first']}`}
				strokeDasharray={strokeDasharray}
				strokeDashoffset={strokeDashoffset}
			/>
			<path
				d="M0.3,0.5a0.2,0.45 0 1,0 0.4,0a0.2,0.45 0 1,0 -0.4,0"
				className={`${styles['stroke-path']} ${styles['stroke-path--second']}`}
				strokeDasharray={strokeDasharray}
				strokeDashoffset={strokeDashoffset}
			/>
			<path
				d="M0.3,0.5a0.2,0.45 0 1,0 0.4,0a0.2,0.45 0 1,0 -0.4,0"
				className={`${styles['stroke-path']} ${styles['stroke-path--third']}`}
				strokeDasharray={strokeDasharray}
				strokeDashoffset={strokeDashoffset}
			/>
		</svg>
	);
};
