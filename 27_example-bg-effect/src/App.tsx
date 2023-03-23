import { useRef } from 'react';
import './App.css';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/**
 * @param axis indicates if window width or height should be the basis for the normalization
 * @return clamped and normalized value between 0 and 80.
 */
const normalizeMousePosition = (value: number, axis: 'x' | 'y') => {
  const max = axis === 'x' ? window.innerWidth : window.innerHeight;
  const clamped = clamp(value, 0, max);
  return (clamped / max) * 80;
};

const HEIGHT = 600;

// Example is based on: https://www.adiutabyte.de/karriere

const App = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  // rootMargin: are when isIntersecting is triggered is reduced or enlarged by the defined margin
  const { isIntersecting } = useIntersectionObserver(boxRef, 'persist', { rootMargin: '-300px' });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { clientX, clientY } = event;

    if (!boxRef.current) return;

    // returns relative position of box in window
    const rect = boxRef.current.getBoundingClientRect();

    // calc absolute x, y position of mouse cursor in the window
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const xPos = normalizeMousePosition(x, 'x');
    const yPos = normalizeMousePosition(y, 'y');

    boxRef.current.style.transform = `translate3d(${xPos}px, ${yPos}px, 0px) scale3d(1, 1, 1)`;
  };

  const handleScroll = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log(event);
  };

  return (
    <>
      <div style={{ height: `100vh` }} />
      <div
        className={`background-vector ${isIntersecting ? 'active' : ''}`}
        ref={boxRef}
        onMouseMove={handleMouseMove}
        onScroll={handleScroll}
        style={{ height: `${HEIGHT}px` }}
      />
      <div style={{ height: `300vh` }} />
    </>
  );
};

export default App;
