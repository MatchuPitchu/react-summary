import { useCurrentFrame, useVideoConfig, Sequence } from 'remotion';
import { Container } from './Container';
import { Map } from './Map';
import { NoiseBackground } from './NoiseBackground';
import { Rain } from './Rain';
import { Strokes } from './Strokes';
import { Paragraph } from './Typography/Paragraph';
import { Title } from './Typography/Title';

export const MyComposition = () => {
	const frame = useCurrentFrame();
	const { fps, durationInFrames, width, height } = useVideoConfig();

	return (
		<Container>
			<NoiseBackground
				speed={0.01}
				maxOffset={50}
				circleRadiusRange={[2, 10]}
			/>

			<Strokes />

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
			<Sequence from={40} durationInFrames={60} layout="none">
				<Paragraph>Only stays mounted 60 frames</Paragraph>
			</Sequence>
			<Map />
			<Rain />
		</Container>
	);
};
