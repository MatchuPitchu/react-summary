import { useEffect, useState } from 'react';

const createSubscribable = <MessageType>() => {
  const subscribers: Set<(msg: MessageType) => void> = new Set();

  // return object with methods that handle subscribers Set
  return {
    subscribe(cb: (msg: MessageType) => void): () => void {
      subscribers.add(cb);
      return () => subscribers.delete(cb);
    },

    publish(msg: MessageType): void {
      subscribers.forEach((cb) => cb(msg));
    },
  };
};

export const createStateHook = <DataType>(initialValue: DataType): (() => [DataType, (value: DataType) => void]) => {
  const subscribers = createSubscribable<DataType>();

  return () => {
    // need to use useState that React notices changes in state manager
    // important: if you use non-primitive data, useState does NOT have
    // a copy of the non-primitive data, it holds only a reference to that data
    // so you can make as many references to this data as you want
    // so you can use this global state thousands of times in your app
    const [value, setValue] = useState<DataType>(initialValue);

    // use useEffect to inform when update happens
    useEffect(() => {
      // on mount setValue is added to subscribe Set
      // this returns an unsubscribe callback
      // that is executed when useEffect cleans up
      return subscribers.subscribe(setValue);
    }, []);

    return [
      value,
      (value: DataType) => {
        setValue(value);
        subscribers.publish(value);
      },
    ];
  };
};
