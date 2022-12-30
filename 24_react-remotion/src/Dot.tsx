import { FC } from 'react';
import {
	interpolate,
	interpolateColors,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import styles from './Dot.module.css';

const getArcPosition = (
	arcWidth: number,
	angleMultiplier: number
): [number, number] => {
	const margin = 100;
	const radius = arcWidth / 2 - margin;

	// angles for half circle
	// const startAngle = Math.PI;
	// const endAngle = 2 * Math.PI;
	const angle = angleMultiplier * Math.PI;
	const x = radius * Math.cos(angle);
	const y = radius * Math.sin(angle);

	return [x, y];
};

export const Dot: FC = () => {
	const frame = useCurrentFrame();
	const { width } = useVideoConfig();

	// spring() animation with it's default settings animates from 0 to 1
	// const driver = spring({
	// 	frame, // frame: frame - 50 would delay animation by 50 frames
	// 	fps,
	// 	durationInFrames,
	// });

	const angleMultiplier = interpolate(frame, [0, 120], [1, 2], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const color = interpolateColors(
		frame,
		[0, 30, 90, 120],
		['#e26023', '#e6bc03', '#e6bc03', '#e26023']
	);

	const [x, y] = getArcPosition(width, angleMultiplier);

	return (
		<div className={styles.container}>
			<div
				className={styles.dot}
				style={{
					transform: `translate(${x}px, ${y}px)`,
					backgroundColor: color,
					boxShadow: `0 0 60px 30px #fff, 0 0 100px 60px ${color}`,
				}}
			></div>
		</div>
	);
};
