import { useQuery } from '@tanstack/react-query'
import { getAuthUser } from '../lib/api.js'


const useAuthUser = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['authUser'],
    queryFn: getAuthUser,
    retry: false, // auth check
    staleTime: 5 * 60 * 60 * 1000, // 5 hours
    refetchOnWindowFocus: false,
  });
  
  // Only show loading on initial fetch, not on errors or refetches
  return {
    isLoading: isLoading && !error, 
    authUser: data?.user || null,
    error
  };
}


export default useAuthUser