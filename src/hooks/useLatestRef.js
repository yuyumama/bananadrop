import { useEffect, useRef } from 'react';

export default function useLatestRef(value) {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}
