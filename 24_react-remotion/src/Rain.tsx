import { FC, useMemo } from 'react';
import { random, AbsoluteFill } from 'remotion';
import { RainDrop } from './RainDrop';

export const Rain: FC = () => {
	const drops = useMemo(() => {
		return new Array(50).fill(true).map((_, i) => {
			// random() API gives deterministic pseudorandom values between 0 and 1
			// unlike Math.random(), it takes in a seed which can be a number or a string
			// if seed is the same, the output is always the same
			const x = `${random(`x-${i}`) * 100}%`;
			const delay = random(`delay-${i}`) * 120;
			const size = random(`size-${i}`);
			return { x, delay, size };
		});
	}, []);

	return (
		<AbsoluteFill>
			{drops.map(({ x, delay, size }) => (
				<RainDrop key={`${x}-${size}`} x={x} delay={delay} size={size} />
			))}
		</AbsoluteFill>
	);
};
