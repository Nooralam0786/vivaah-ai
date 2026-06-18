/**
 * API Query Hook (wrapper around React Query)
 */

'use client';

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import apiClient from '@/lib/api';

export function useApiQuery<T = unknown>(
  key: string[],
  queryFn: () => Promise<T>,
  options?: Omit<UseQueryOptions<T, AxiosError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, AxiosError>({
    queryKey: key,
    queryFn,
    ...options,
  });
}

export function useApiMutation<T = unknown, D = unknown>(
  mutationFn: (data: D) => Promise<T>,
  options?: Omit<UseMutationOptions<T, AxiosError, D>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation<T, AxiosError, D>({
    mutationFn,
    onSuccess: () => {
      // Optionally invalidate queries on success
      queryClient.invalidateQueries();
    },
    ...options,
  });
}

export function useGet<T = unknown>(
  url: string,
  options?: Omit<UseQueryOptions<T, AxiosError>, 'queryKey' | 'queryFn'>
) {
  return useApiQuery<T>(
    [url],
    async () => {
      const data = await apiClient.get<T>(url);
      return data as T;
    },
    options
  );
}

export function usePost<T = unknown, D = unknown>(
  url: string,
  options?: Omit<UseMutationOptions<T, AxiosError, D>, 'mutationFn'>
) {
  return useApiMutation<T, D>(
    async (data) => {
      const result = await apiClient.post<T>(url, data);
      return result as T;
    },
    options
  );
}

export function useDelete<T = unknown>(
  url: string,
  options?: Omit<UseMutationOptions<T, AxiosError, void>, 'mutationFn'>
) {
  return useApiMutation<T, void>(
    async () => {
      const result = await apiClient.delete<T>(url);
      return result as T;
    },
    options
  );
}
