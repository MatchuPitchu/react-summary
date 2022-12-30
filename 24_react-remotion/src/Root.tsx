import { FC } from 'react';
import { Composition, Folder } from 'remotion';
import { Video } from './Video';

export const RemotionRoot: FC = () => {
	return (
		<>
			<Folder name="folder-helps-to-structure-multiple-videos">
				<Composition
					id="VideoId"
					component={Video}
					durationInFrames={240} // 240 / 30fps = 8sec
					fps={30}
					width={1920}
					height={1080}
				/>
			</Folder>
		</>
	);
};
