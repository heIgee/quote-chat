import { useState, useEffect, useCallback } from 'react';

// interface UseFetchResult<T> {
//   data: T | null;
// error: Error | null;
//   isLoading: boolean;
// }

export function useFetch<T>(
  url: string,
  delay: number = 0,
): [data: T | null, error: Error | null, isLoading: boolean] {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`HTTP Response not OK! Status: ${response.status}`);
      }
      const data = await response.json();
      setData(data);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }

    return () => controller.abort();
  }, [url]);

  useEffect(() => {
    const timerId = setTimeout(fetchData, delay);
    return () => clearTimeout(timerId);
  }, [fetchData, delay]);

  return [data, error, isLoading];
}
