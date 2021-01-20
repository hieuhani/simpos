import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export function useQueryParams() {
  const location = useLocation();
  const searchParams = useMemo(() => {
    return new URLSearchParams(location.search);
  }, [location]);
  return searchParams;
}
