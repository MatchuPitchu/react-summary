import { useRef } from 'react';
import {
	AbsoluteFill,
	interpolateColors,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import styles from './Circle.module.css';

const TIME_STEPS = 60;

export const Circle = () => {
	const frame = useCurrentFrame();
	const { width, height, durationInFrames } = useVideoConfig();

	const circleRef = useRef<SVGCircleElement>(null);
	const strokeLength = circleRef.current?.getTotalLength() || 1256.812744140625;
	const strokeIncrement = strokeLength / TIME_STEPS;
	const strokeDashoffset =
		strokeLength - strokeIncrement * (TIME_STEPS - frame / 30); // frame / 30 -> seconds in video

	const backgroundColor = interpolateColors(
		frame,
		[0, durationInFrames],
		['#ffffff', '#032d41']
	);

	const circleColor = interpolateColors(
		frame,
		[0, durationInFrames - 30 * 30, durationInFrames],
		['#032d41', '#e5a62f', '#791402']
	);

	const textColor = interpolateColors(
		frame,
		[0, durationInFrames],
		['#000000', '#ffffff']
	);
	// V2: animate normally circle with interval AND without Remotion
	// const [totalTimeStepsRemaining, setTotalTimeStepsRemaining] =
	//   useState(TIME_STEPS);

	// useEffect(() => {
	// 	if (!circleRef.current) return;
	// 	const strokeLength = circleRef.current.getTotalLength();
	// 	const strokeIncrement = strokeLength / TIME_STEPS;

	// 	circleRef.current.style.setProperty(
	// 		'--strokeLength',
	// 		strokeLength.toString()
	// 	);
	// 	circleRef.current.style.setProperty(
	// 		'--strokeIncrement',
	// 		strokeIncrement.toString()
	// 	);

	// 	const strokeDashoffset =
	// 		strokeLength - strokeIncrement * totalTimeStepsRemaining;

	// 	const drawCircle = () => {
	// 		if (totalTimeStepsRemaining > 0) {
	// 			circleRef.current?.style.setProperty(
	// 				'--strokeCalc',
	// 				strokeDashoffset.toString()
	// 			);
	// 		} else {
	// 			circleRef.current?.style.setProperty(
	// 				'--strokeCalc',
	// 				strokeLength.toString()
	// 			);
	// 		}
	// 		setTotalTimeStepsRemaining((prev) => (prev > 0 ? prev - 1 : TIME_STEPS));
	// 	};

	// 	const intervalId = setInterval(() => {
	// 		drawCircle();
	// 	}, 1000);

	// 	return () => clearInterval(intervalId);
	// }, [circleRef.current, totalTimeStepsRemaining]);

	return (
		<AbsoluteFill style={{ backgroundColor }}>
			<svg
				className={styles.timer}
				style={{ color: circleColor }}
				width={width}
				height={height}
				viewBox="0 0 500 500"
			>
				<g>
					<circle
						ref={circleRef}
						className={styles['timer__circle']}
						style={{}}
						cx={250}
						cy={250}
						r={200}
						strokeDasharray={strokeLength}
						strokeDashoffset={strokeDashoffset}
					/>
					<text
						className={styles['timer__text']}
						fill={textColor}
						x={250}
						y={250}
						alignmentBaseline="middle"
						textAnchor="middle"
					>
						{Math.floor(frame / 30)} Sekunden
					</text>
				</g>
			</svg>
		</AbsoluteFill>
	);
};
