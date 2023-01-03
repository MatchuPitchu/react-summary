import { CSSProperties, ReactNode, FC } from 'react';
import {
	AbsoluteFill,
	Img,
	interpolateColors,
	staticFile,
	useCurrentFrame,
} from 'remotion';
import { NoiseBackground } from './NoiseBackground';
import styles from './Container.module.css';

// get URL reference of asset
const myImage = staticFile(`/background-skyline-berlin.svg`);

type Props = {
	children: ReactNode;
};

const backgroundImageStyle: CSSProperties = {
	position: 'absolute',
	left: '0',
	bottom: '-10px',
	zIndex: 1,
};

export const Container: FC<Props> = ({ children }) => {
	const frame = useCurrentFrame();

	const backgroundColor = interpolateColors(
		frame,
		[0, 60, 90, 120],
		['#032d41', '#B9E7FD', '#B9E7FD', '#032d41']
	);

	return (
		<AbsoluteFill className={styles.container} style={{ backgroundColor }}>
			<NoiseBackground
				speed={0.01}
				maxOffset={20}
				circleRadiusRange={[2, 10]}
			/>
			<Img style={backgroundImageStyle} src={myImage} />
			{children}
		</AbsoluteFill>
	);
};
