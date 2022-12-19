import { useState, useCallback } from 'react';

// custom hook to send any kind of HTTP request to any kind of URL and
// to work with JSON data
const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // use useCallback to avoid infinite loop when using sendRequest fn
  // as dependency in useEffect in a component
  const sendRequest = useCallback(async (requestConfig, applyDataFn) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(requestConfig.url, {
        // default settings are added in case that no arguments are passed
        method: requestConfig.method ? requestConfig.method : 'GET',
        headers: requestConfig.headers ? requestConfig.headers : {},
        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
      });

      if (!res.ok) throw new Error('Request failed!');

      const data = await res.json();
      // in the hook we just hand the data off to the applyDataFn, but the fn itself and
      // what happens in the fn is provided by the component that uses hook
      applyDataFn(data);
    } catch (err) {
      setError(err.message || 'Something went wrong!');
    }
    setIsLoading(false);
  }, []); // dependency arr should list all external changable data used in fn

  return {
    isLoading,
    error,
    sendRequest,
  };
};

export default useHttp;
