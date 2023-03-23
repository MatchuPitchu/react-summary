import { useEffect, useMemo, useState } from 'react';
import type { RefObject } from 'react';

type IntersectionObserverBounds = Readonly<Record<'height' | 'width' | 'top' | 'left' | 'right' | 'bottom', number>>;

interface MockIntersectionObserverEntry {
  readonly time: number | null;
  readonly rootBounds: IntersectionObserverBounds | null;
  readonly boundingClientRect: IntersectionObserverBounds | null;
  readonly intersectionRect: IntersectionObserverBounds | null;
  readonly intersectionRatio: number | null;
  readonly target: HTMLElement | null;
  readonly isIntersecting: boolean;
}

interface IntersectionObserverOptions {
  root?: HTMLElement | null;
  rootMargin?: string;
  threshold?: number | number[];
  initialIsIntersecting?: boolean;
}

interface IntersectionObserverObject {
  observer: IntersectionObserver;
  getListeners: () => Set<IntersectionObserverCallback>;
  subscribe: (cb: IntersectionObserverCallback) => void;
  unsubscribe: (cb: IntersectionObserverCallback) => void;
}

const createIntersectionObserver = (options: IntersectionObserverOptions): IntersectionObserverObject => {
  const { root = null, rootMargin = '0px 0px 0px 0px', threshold = 0 } = options;

  const callbacks: Set<IntersectionObserverCallback> = new Set();

  const observer = new IntersectionObserver(
    (entries) => {
      for (const callback of callbacks) {
        callback(entries, observer);
      }
    },
    { root, rootMargin, threshold }
  );

  return {
    observer,
    getListeners: () => callbacks,
    subscribe: (callback: IntersectionObserverCallback) => callbacks.add(callback),
    unsubscribe: (callback: IntersectionObserverCallback) => callbacks.delete(callback),
  };
};

const intersectionObserver: Map<HTMLElement | null | undefined, Record<string, IntersectionObserverObject>> = new Map();

const getIntersectionObserver = (options: IntersectionObserverOptions) => {
  const { root, ...keys } = options;
  const key = JSON.stringify(keys);

  let observer = intersectionObserver.get(root)?.[key];

  if (!observer) {
    observer = createIntersectionObserver(options);
    intersectionObserver.set(root, { [key]: observer });
  }

  return observer;
};

export const useIntersectionObserver = <T extends HTMLElement = HTMLElement>(
  target: RefObject<T> | T | null,
  firstIntersectBehavior: 'disconnect' | 'persist',
  options: IntersectionObserverOptions = {}
): MockIntersectionObserverEntry | IntersectionObserverEntry => {
  const { root = null, rootMargin = '0px 0px 0px 0px', threshold = 0, initialIsIntersecting = false } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry | MockIntersectionObserverEntry>(() => ({
    boundingClientRect: null,
    intersectionRatio: 0,
    intersectionRect: null,
    isIntersecting: initialIsIntersecting,
    rootBounds: null,
    target: null,
    time: 0,
  }));

  const observer = useMemo(
    () => getIntersectionObserver({ root, rootMargin, threshold }),
    [root, rootMargin, threshold]
  );

  useEffect(() => {
    if (!target || !observer) return;

    const targetElement = 'current' in target ? target.current : target;
    if (!targetElement) return;

    const disconnect = (handleIntersect: (entries: IntersectionObserverEntry[]) => void) => {
      observer.unsubscribe(handleIntersect);
      observer.observer.unobserve(targetElement);
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.target === targetElement) {
          setEntry(entry);

          if (firstIntersectBehavior === 'disconnect' && entry.isIntersecting) {
            disconnect(handleIntersect);
          }
        }
      }
    };

    observer.subscribe(handleIntersect);
    observer.observer.observe(targetElement);

    return () => disconnect(handleIntersect);
  }, [target, observer, firstIntersectBehavior]);

  return entry;
};
