import { CSSProperties, ReactNode, FC } from 'react';
import { Img, interpolateColors, staticFile, useCurrentFrame } from 'remotion';
import { NoiseBackground } from './NoiseBackground';

// get URL reference of asset
const myImage = staticFile(`/background-skyline-berlin.svg`);

type Props = {
	children: ReactNode;
};

const containerStyle: CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
	height: '100%',
	width: '100%',
	padding: '0',
	placeItems: 'center',
	zIndex: -2,
};

const backgroundImageStyle: CSSProperties = {
	position: 'absolute',
	left: '0',
	bottom: '0',
};

export const Container: FC<Props> = ({ children }) => {
	const frame = useCurrentFrame();

	const backgroundColor = interpolateColors(
		frame,
		[0, 60, 90, 120],
		['#032d41', '#B9E7FD', '#B9E7FD', '#032d41']
	);

	return (
		<div style={{ ...containerStyle, backgroundColor }}>
			<NoiseBackground
				speed={0.01}
				maxOffset={20}
				circleRadiusRange={[2, 10]}
			/>
			<Img style={backgroundImageStyle} src={myImage} />
			{children}
		</div>
	);
};
