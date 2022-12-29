import { useMemo } from 'react';
import { random, AbsoluteFill } from 'remotion';
import { RainDrop } from './RainDrop';

export const Rain = () => {
	const drops = useMemo(() => {
		return new Array(100).fill(true).map((_, i) => {
			const x = `${random(`x-${i}`) * 100}%`;
			const delay = random(`delay-${i}`) * 120;
			const size = random(`size-${i}`) + 0.3;
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
