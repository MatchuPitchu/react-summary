import { FC } from 'react';
import { Composition } from 'remotion';
import { MyComposition } from './Composition';

export const RemotionRoot: FC = () => {
	return (
		<>
			<Composition
				id="VideoId"
				component={MyComposition}
				durationInFrames={120} // 120 / 30fps = 4sec
				fps={30}
				width={1920}
				height={1080}
			/>
		</>
	);
};
