import { FC } from 'react';
import { useCurrentFrame, interpolate, useVideoConfig, spring } from 'remotion';

type Props = {
	delay: number;
	x: string;
	size: number;
};

export const RainDrop: FC<Props> = ({ delay, x, size }) => {
	const { fps } = useVideoConfig();
	const frame = useCurrentFrame();

	// spring() animation with it's default settings animates from 0 to 1
	const drop = spring({
		fps,
		frame: frame - delay, // frame - x: delays animation by x frames
		config: {
			damping: 1000,
		},
	});

	const top = interpolate(drop, [0, 1], [-0.2, 1.1]);

	return (
		<svg
			viewBox="0 0 800 800"
			style={{
				position: 'absolute',
				width: 100,
				left: x,
				top: `${top * 100}%`,
				transform: `scale(${size})`,
			}}
		>
			<path
				fill="#72F4F7"
				d="M681.9,552.8c0,136.7-129,247.2-288.7,247.2S104.5,689.4,104.5,552.8S233.5,0,393.2,0S681.9,416.1,681.9,552.8z
	"
			/>
			<path
				fill="#5EE0EA"
				d="M393.2,0c159.7,0,288.7,416.1,288.7,552.8S552.9,800,393.2,800S104.5,689.4,104.5,552.8"
			/>
			<path
				fill="#30B9D8"
				d="M393.2,0c159.7,0,288.7,416.1,288.7,552.8S552.9,800,393.2,800"
			/>
			<path fill="#27AAC9" d="M681.9,552.8c0,136.7-129,247.2-288.7,247.2" />
			<g>
				<path
					fill="#72F4F7"
					d="M325.6,419.2c0,20-15.4,35.3-35.3,35.3c-20,0-35.3-15.4-35.3-35.3s15.4-35.3,35.3-35.3
		C310.3,385.4,325.6,400.8,325.6,419.2z"
				/>
				<path
					fill="#72F4F7"
					d="M204.3,519c0,6.1-4.6,10.7-10.7,10.7c-6.1,0-10.7-4.6-10.7-10.7c0-6.1,4.6-10.7,10.7-10.7
		C199.7,508.3,204.3,512.9,204.3,519z"
				/>
				<circle fill="#72F4F7" cx="298" cy="284.1" r="13.8" />
				<circle fill="#72F4F7" cx="278" cy="351.6" r="3.1" />
				<path
					fill="#72F4F7"
					d="M356.3,208.8c0,3.1-1.5,4.6-4.6,4.6c-3.1,0-4.6-1.5-4.6-4.6s1.5-4.6,4.6-4.6
		C354.8,204.2,356.3,205.8,356.3,208.8z"
				/>
				<circle fill="#72F4F7" cx="276.5" cy="626.5" r="36.9" />
				<circle fill="#72F4F7" cx="328.7" cy="529.8" r="13.8" />
				<circle fill="#72F4F7" cx="181.3" cy="620.3" r="15.4" />
			</g>
			<g>
				<circle fill="#5EE0EA" cx="485.3" cy="176.6" r="39.9" />
				<circle fill="#5EE0EA" cx="436.2" cy="82.9" r="7.7" />
				<circle fill="#5EE0EA" cx="474.6" cy="301" r="9.2" />
				<circle fill="#5EE0EA" cx="542.1" cy="445.3" r="9.2" />
			</g>
		</svg>
	);
};
