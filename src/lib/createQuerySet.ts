import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { KY } from '#/lib/KY.ts'
import type { PaginatedResponse } from '#/types/common'

interface QuerySetOptions<T> {
  resource: string
}

export function createQuerySet<
  TList,
  TDetail = TList,
  TCreate = Partial<TDetail>,
  TUpdate = Partial<TDetail>,
>({ resource }: QuerySetOptions<TDetail>) {
  const baseKey = [resource]

  const listOptions = (params?: Record<string, string | number>) =>
    queryOptions({
      queryKey: [...baseKey, 'list', params],
      queryFn: () =>
        KY.get(resource + '/', { searchParams: params as any }).json<
          PaginatedResponse<TList>
        >(),
    })

  const detailOptions = (id: string | number) =>
    queryOptions({
      queryKey: [...baseKey, 'detail', id],
      queryFn: () => KY.get(`${resource}/${id}/`).json<TDetail>(),
    })

  function useList(params?: Record<string, string | number>) {
    return useQuery(listOptions(params))
  }

  function useDetail(id: string | number) {
    return useQuery(detailOptions(id))
  }

  function useCreate() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (data: TCreate) =>
        KY.post(`${resource}/`, { json: data }).json<TDetail>(),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: baseKey })
      },
    })
  }

  function useUpdate() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, data }: { id: string | number; data: TUpdate }) =>
        KY.patch(`${resource}/${id}/`, { json: data }).json<TDetail>(),
      onSuccess: async (_, { id }) => {
        await queryClient.invalidateQueries({ queryKey: baseKey })
        await queryClient.invalidateQueries({
          queryKey: [...baseKey, 'detail', id],
        })
      },
    })
  }

  function useReplace() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, data }: { id: string | number; data: TCreate }) =>
        KY.put(`${resource}/${id}/`, { json: data }).json<TDetail>(),
      onSuccess: async (_, { id }) => {
        await queryClient.invalidateQueries({ queryKey: baseKey })
        await queryClient.invalidateQueries({
          queryKey: [...baseKey, 'detail', id],
        })
      },
    })
  }

  function useDelete() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (id: string | number) =>
        KY.delete(`${resource}/${id}/`).json<void>(),
      onSuccess: async (_, id) => {
        await queryClient.invalidateQueries({ queryKey: baseKey })
        await queryClient.invalidateQueries({
          queryKey: [...baseKey, 'detail', id],
        })
      },
    })
  }

  function useAction<TPayload, TResponse>(action: string) {
    return useMutation({
      mutationFn: ({ id, data }: { id: string | number; data: TPayload }) =>
        KY.post(`${resource}/${id}/${action}/`, {
          json: data,
        }).json<TResponse>(),
    })
  }

  function useInvalidateAll() {
    const queryClient = useQueryClient()
    return () => queryClient.invalidateQueries({ queryKey: baseKey })
  }

  function useInvalidate() {
    const queryClient = useQueryClient()
    return (id: string | number) =>
      queryClient.invalidateQueries({ queryKey: [...baseKey, 'detail', id] })
  }
  function useListAction<TResponse>(
    action: string,
    params?: Record<string, string | number>,
  ) {
    return useQuery({
      queryKey: [...baseKey, action, params],
      queryFn: () =>
        KY.get(`${resource}/${action}/`, {
          searchParams: params as any,
        }).json<TResponse>(),
    })
  }
  return {
    listOptions,
    detailOptions,
    useList,
    useDetail,
    useCreate,
    useUpdate,
    useReplace,
    useDelete,
    useAction,
    useInvalidateAll,
    useInvalidate,
    useListAction,
    keys: {
      all: baseKey,
      lists: [...baseKey, 'list'],
      list: (params?: Record<string, string | number>) => [
        ...baseKey,
        'list',
        params,
      ],
      details: [...baseKey, 'detail'],
      detail: (id: string | number) => [...baseKey, 'detail', id],
    },
  }
}
