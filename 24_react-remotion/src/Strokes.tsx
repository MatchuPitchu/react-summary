import { FC, useEffect, useRef } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import styles from './Strokes.module.css';

export const Strokes: FC = () => {
	const frame = useCurrentFrame();
	const svgElement = useRef<SVGSVGElement>(null);
	const stroke = useRef<SVGPathElement>(null);
	const strokeLength = stroke.current?.getTotalLength() || 2;

	useEffect(() => {
		if (!svgElement) return;
		svgElement.current?.style.setProperty(
			'--stroke-length',
			strokeLength.toString()
		);
	}, [strokeLength]);

	const opacity = interpolate(frame, [0, 60], [0, 1], {
		extrapolateRight: 'clamp',
	});

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
				strokeDasharray={`${strokeLength * 0.2} ${strokeLength * 0.8}`}
			/>
			<path
				d="M0.3,0.5a0.2,0.45 0 1,0 0.4,0a0.2,0.45 0 1,0 -0.4,0"
				className={`${styles['stroke-path']} ${styles['stroke-path--second']}`}
				strokeDasharray={`${strokeLength * 0.2} ${strokeLength * 0.8}`}
			/>
			<path
				d="M0.3,0.5a0.2,0.45 0 1,0 0.4,0a0.2,0.45 0 1,0 -0.4,0"
				className={`${styles['stroke-path']} ${styles['stroke-path--third']}`}
				strokeDasharray={`${strokeLength * 0.2} ${strokeLength * 0.8}`}
			/>
		</svg>
	);
};
