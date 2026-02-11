import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql';

export function useFetchData<T>(
    queryKey: string[],
    graphqlQuery: string,
    variables?: Record<string, any>,
    options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
) {
    const { token } = useSelector((state: RootState) => state.auth);

    return useQuery<T, Error>({
        queryKey: [...queryKey, variables],
        queryFn: async () => {
            const response = await axios.post(
                API_BASE_URL,
                {
                    query: graphqlQuery,
                    variables,
                },
                {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : '',
                    },
                }
            );

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }

            return response.data.data;
        },
        ...options,
    });
}
