import { useQuery } from '@tanstack/react-query'
import { getAuthUser } from '../lib/api.js'


const useAuthUser = () => {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['authUser'],
    queryFn: getAuthUser,
    retry: 1, // retry once on failure
    retryDelay: 500,
    staleTime: 5 * 60 * 1000, // 5 minutes - reduce unnecessary refetches
    gcTime: 10 * 60 * 1000, // 10 minutes cache time
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
  
  return {
    isLoading: isLoading && !error, 
    authUser: data?.user || null,
    error,
    isFetching,
  };
}


export default useAuthUser