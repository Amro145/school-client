import { useQuery, UseQueryOptions, useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';

export const fetchData = async <T>(
    graphqlQuery: string,
    variables?: Record<string, any>
): Promise<T> => {
    const response = await api.post('', {
        query: graphqlQuery,
        variables,
    });

    if (response.data.errors) {
        const message = response.data.errors.map((e: any) => e.message).join(', ');
        throw new Error(message || 'GraphQL Execution Error');
    }

    return response.data.data;
};

export function useFetchData<T>(
    queryKey: string[],
    graphqlQuery: string,
    variables?: Record<string, any>,
    options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery<T, Error>({
        queryKey: [...queryKey, variables],
        queryFn: () => fetchData<T>(graphqlQuery, variables),
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
