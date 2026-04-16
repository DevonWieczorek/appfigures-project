import { useEffect, useRef, useState } from "react"

type SearchState<T> = {
  data: T | null
  loading: boolean
  error: Error | null
}

type UseDebouncedSearchOptions<T> = {
  endpoint: string
  delay?: number
  enabled?: boolean
  fetcher: (endpoint: string, signal: AbortSignal) => Promise<T>
  onSuccess?: (data: T) => void
}

export function useDebouncedSearch<T>({
  endpoint,
  delay = 400,
  enabled = true,
  fetcher,
  onSuccess
}: UseDebouncedSearchOptions<T>) {
  const [state, setState] = useState<SearchState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const timeoutRef = useRef<number | null>(null)
  const controllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!enabled) return

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }

    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller

    timeoutRef.current = window.setTimeout(async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      try {
        const data = await fetcher(endpoint, controller.signal)
        setState({ data, loading: false, error: null })
        onSuccess?.(data)
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err : new Error("Request failed"),
        })
      }
    }, delay)

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
      controller.abort()
    }
  }, [endpoint, delay, enabled, fetcher, onSuccess])

  return state
}