import { FC } from 'react';
import { useCurrentFrame, useVideoConfig, Sequence } from 'remotion';
import { Container } from './Container';
import { Dot } from './Dot';
import { Map } from './Map';
import { NoiseBackground } from './NoiseBackground';
import { Rain } from './Rain';
import { Strokes } from './Strokes';
import { Paragraph } from './Typography/Paragraph';
import { Title } from './Typography/Title';

export const Video: FC = () => {
	const frame = useCurrentFrame();
	const { fps, durationInFrames, width, height } = useVideoConfig();

	return (
		<Container>
			<NoiseBackground
				speed={0.01}
				maxOffset={50}
				circleRadiusRange={[2, 10]}
			/>

			<Title>
				Video {width}x{height}
			</Title>

			<Paragraph>Frame: {frame}</Paragraph>

			<Sequence from={20} layout="none">
				<Paragraph>FPS: {fps}</Paragraph>
			</Sequence>
			<Sequence from={40} layout="none">
				<Paragraph>Duration: {durationInFrames / fps}s</Paragraph>
			</Sequence>
			<Sequence from={40} durationInFrames={120} layout="none">
				<Paragraph>Only stays mounted 120 frames</Paragraph>
			</Sequence>

			<Map />

			<Sequence from={0} layout="none">
				<Dot />
			</Sequence>

			<Sequence from={120} layout="none">
				<Rain />
			</Sequence>

			<Sequence from={120} layout="none">
				<Strokes />
			</Sequence>
		</Container>
	);
};
