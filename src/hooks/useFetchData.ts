import { useQuery, UseQueryOptions, useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://schoolapi.amroaltayeb14.workers.dev/graphql';

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
                const message = response.data.errors.map((e: any) => e.message).join(', ');
                throw new Error(message || 'GraphQL Execution Error');
            }

            return response.data.data;
        },
        ...options,
    });
}

export function useMutateData<TData = any, TVariables = any>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    invalidateKeys?: string[][],
    options?: UseMutationOptions<TData, Error, TVariables>
) {
    const queryClient = useQueryClient();

    return useMutation<TData, Error, TVariables, any>({
        ...options,
        mutationFn,
        onSuccess: (...args) => {
            if (invalidateKeys) {
                invalidateKeys.forEach(key => queryClient.invalidateQueries({ queryKey: key }));
            }
            if (options?.onSuccess) {
                (options.onSuccess as any)(...args);
            }
        },
    });
}
