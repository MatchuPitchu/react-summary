import { CSSProperties, FC } from 'react';
// https://www.remotion.dev/docs/noise-visualization
import { noise3D } from '@remotion/noise';
import { interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';

type Props = {
	circleRadiusRange: [number, number];
	speed?: number;
	maxOffset?: number;
};

const COLS = 30;
const ROWS = 10;
const MARGIN_BETWEEN_DOTS = 300;
const FRAME_DAY_NIGHT_SHIFT = 120;

const style: CSSProperties = {
	position: 'absolute',
	zIndex: -1,
};

export const NoiseBackground: FC<Props> = ({
	circleRadiusRange,
	speed = 0.01,
	maxOffset = 50,
}) => {
	const frame = useCurrentFrame();
	const { height, width } = useVideoConfig();

	const isNight = frame > FRAME_DAY_NIGHT_SHIFT;

	const opacity = interpolate(
		frame,
		[
			FRAME_DAY_NIGHT_SHIFT - 30,
			FRAME_DAY_NIGHT_SHIFT,
			FRAME_DAY_NIGHT_SHIFT + 1,
			FRAME_DAY_NIGHT_SHIFT + 30,
		],
		[1, 0, 0, 1],
		{
			extrapolateRight: 'clamp', // if frame becomes > 60 output range would be > 1, so need to clamp range at 1
		}
	);

	const dots = new Array(COLS).fill(true).map((_, i) => {
		return new Array(ROWS).fill(true).map((_, j) => {
			const x = i * ((width + MARGIN_BETWEEN_DOTS) / COLS);
			const y = j * ((height + MARGIN_BETWEEN_DOTS) / ROWS);

			const randomizer = random(`x-${i}-${j}`);

			const px = i / COLS;
			const py = j / ROWS;
			const varianceX = noise3D('x', px, py, frame * speed) * maxOffset;
			const varianceY = noise3D('y', px, py, frame * speed) * maxOffset;

			const opacityDot = interpolate(
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

			return isNight ? (
				// V1: CIRCLE STAR NOISE
				<circle
					key={key}
					cx={x * randomizer + varianceX}
					cy={y * randomizer + varianceY}
					r={radius}
					fill="orange"
					opacity={opacityDot}
				/>
			) : (
				// V2: CLOUD NOISE
				<svg
					key={key}
					x={x * randomizer + varianceX}
					y={y * randomizer + varianceY}
					opacity={opacityDot}
				>
					<path
						d="m391.84 540.91c-.421-.329-.949-.524-1.523-.524-1.351 0-2.451 1.084-2.485 2.435-1.395.526-2.388 1.88-2.388 3.466 0 1.874 1.385 3.423 3.182 3.667v.034h12.73v-.006c1.775-.104 3.182-1.584 3.182-3.395 0-1.747-1.309-3.186-2.994-3.379.007-.106.011-.214.011-.322 0-2.707-2.271-4.901-5.072-4.901-2.073 0-3.856 1.202-4.643 2.925"
						fill="#ffffff"
						transform="matrix(.77976 0 0 .78395-299.99-418.63)"
					/>
				</svg>
			);
		});
	});

	return (
		<svg
			style={style}
			width={width}
			height={height}
			transform={`scale(${isNight ? 1 : 5})`}
			opacity={opacity}
		>
			{dots}
		</svg>
	);
};
