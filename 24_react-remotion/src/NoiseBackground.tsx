import { CSSProperties } from 'react';

// https://www.remotion.dev/docs/noise-visualization
import { noise3D } from '@remotion/noise';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

type Props = {
	circleRadiusRange: [number, number];
	speed?: number;
	maxOffset?: number;
};

const COLS = 15;
const ROWS = 10;
const OVERSCAN_MARGIN = 100;

const style: CSSProperties = {
	position: 'absolute',
};

export const NoiseBackground = ({
	circleRadiusRange,
	speed = 0.01,
	maxOffset = 50,
}: Props) => {
	const frame = useCurrentFrame();
	const { height, width } = useVideoConfig();

	const dots = new Array(COLS).fill(true).map((_, i) => {
		return new Array(ROWS).fill(true).map((_, j) => {
			const x = i * ((width + OVERSCAN_MARGIN) / COLS);
			const y = j * ((height + OVERSCAN_MARGIN) / ROWS);

			const px = i / COLS;
			const py = j / ROWS;
			const varianceX = noise3D('x', px, py, frame * speed) * maxOffset;
			const varianceY = noise3D('y', px, py, frame * speed) * maxOffset;

			const opacity = interpolate(
				noise3D('opacity', i, j, frame * speed),
				[-1, 1], // noise3D returns value between -1 and +1
				[0, 1]
			);
			const radius = interpolate(
				noise3D('opacity', i, j, frame * speed),
				[-1, 1],
				circleRadiusRange
			);

			const key = `${i}-${j}`;

			return (
				<circle
					key={key}
					cx={x + varianceX}
					cy={y + varianceY}
					r={radius}
					fill="orange"
					opacity={opacity}
				/>
			);
		});
	});

	return (
		<svg style={style} width={width} height={height}>
			{dots}
		</svg>
	);
};
