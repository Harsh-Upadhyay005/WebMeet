import { useQuery } from '@tanstack/react-query'
import { getAuthUser } from '../lib/api.js'


const useAuthUser = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['authUser'],
    queryFn: getAuthUser,
    retry: false, // auth check
    staleTime: 0, // Always refetch to ensure up-to-date auth state
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