import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LoadMoreButton } from "@/components/load-more-button"
import { ReviewsFeed } from "@/components/reviews-feed"
import {
  ReviewsSkeleton,
  ReviewsError,
  ReviewsNotFound,
  ReviewsRenderError
} from "@/components/reviews-placeholder"
import { SearchFilters } from "@/components/search-filters"
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch"
import { ErrorBoundary } from "@/components/error-boundary"
import type { ReviewItem, ReviewsResponse } from "@/types/reviews"
import {
  ALL_STARS_OPTION,
  STARS_VALUES,
  type ReviewsEndpointParams,
  type ReviewsQueryParams,
  type StarsSelectValue,
  type StarsValue,
} from "@/types/filters"
import './styles/index.css'

const BASE_REQUEST_URL = import.meta.env.VITE_BASE_REQUEST_URL;
const VALID_STARS = new Set<string>(STARS_VALUES);
const DEFAULT_PER_PAGE = 25;

async function fetchReviews(endpoint: string, signal: AbortSignal): Promise<ReviewsResponse> {
  const res = await fetch(endpoint, { signal })
  if (!res.ok) throw new Error("Failed to fetch reviews");
  return res.json();
}

function getNormalizedQuery(searchParams: URLSearchParams): string {
  return searchParams.get('q')?.trim() ?? '';
}

function getNormalizedStars(searchParams: URLSearchParams): ReviewsQueryParams['stars'] {
  const value = searchParams.get('stars') ?? '';
  return VALID_STARS.has(value) ? (value as StarsValue) : '';
}

function getNormalizedPage(searchParams: URLSearchParams): number {
  const pageQuery = Number.parseInt(searchParams.get('page') ?? '', 10);
  return Number.isInteger(pageQuery) && pageQuery > 0 ? pageQuery : 1;
}

function buildCanonicalSearchParams({ q, stars, page }: ReviewsQueryParams): URLSearchParams {
  const next = new URLSearchParams();
  if (q) next.set('q', q);
  if (stars) next.set('stars', stars);
  if (page > 1) next.set('page', page.toString());
  return next;
}

function buildReviewsEndpoint({
  q,
  stars,
  page,
  isInitialLoading,
}: ReviewsEndpointParams): string {
  const params = new URLSearchParams();

  if (q) params.set("q", q);
  if (stars) params.set("stars", stars);

  // Handle deep linking to page > 1 with a single initial request.
  if (isInitialLoading && page > 1) {
    const count = page * DEFAULT_PER_PAGE;
    params.set("page", "1");
    params.set("count", count.toString());
  } else {
    params.set("page", page.toString());
  }

  return `${BASE_REQUEST_URL}?${params.toString()}`;
}

function setParamOrDelete(next: URLSearchParams, key: string, value: string) {
  if (value) next.set(key, value);
  else next.delete(key);
}

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loadedFilterKey, setLoadedFilterKey] = useState<string | null>(null);
  const [reachedEndOfList, setReachedEndOfList] = useState(false);

  const q = useMemo(() => getNormalizedQuery(searchParams), [searchParams]);
  const stars = useMemo(() => getNormalizedStars(searchParams), [searchParams]);
  const page = useMemo(() => getNormalizedPage(searchParams), [searchParams]);
  const filterKey = useMemo(() => `${q}|${stars}`, [q, stars]);
  const isInitialLoading = loadedFilterKey !== filterKey;
  const [keywordInput, setKeywordInput] = useState(q);

  // Used for keeping url param and input value in sync
  useEffect(() => {
    setKeywordInput(q);
  }, [q]);

  // Handle no reviews returned for subsequent calls (page !== 1)
  useEffect(() => {
    setReachedEndOfList(false);
  }, [filterKey]);

  // Handle updating of filter values and syncing to url
  useEffect(() => {
    const next = buildCanonicalSearchParams({ q, stars, page });

    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [q, stars, page, searchParams, setSearchParams]);

  // Keep endpoint url up to date with filter values
  const endpoint = useMemo(
    () => buildReviewsEndpoint({ q, stars, page, isInitialLoading }),
    [q, stars, page, isInitialLoading]
  );

  const handleSuccess = useCallback((next: ReviewsResponse) => {
    const nextReviews = next.reviews ?? [];

    // Load more (page > 1 after initial load for this filter): append new rows only.
    // Empty page = end of list — leave existing reviews as-is so we never flash ReviewsNotFound.
    if (page > 1 && !isInitialLoading) {
      if (nextReviews.length === 0) {
        setReachedEndOfList(true);
        setLoadedFilterKey(filterKey);
        return;
      }
      setReachedEndOfList(false);
      setReviews((prev) => [...prev, ...nextReviews]);
      setLoadedFilterKey(filterKey);
      return;
    }

    // First page, filter change, or deep-link bulk fetch (page > 1 while still "initial" for this filter).
    setReachedEndOfList(false);
    setReviews(nextReviews);
    setLoadedFilterKey(filterKey);
  }, [filterKey, isInitialLoading, page]);

  const { loading, error } = useDebouncedSearch({
    endpoint,
    delay: 350,
    enabled: true,
    fetcher: fetchReviews,
    onSuccess: handleSuccess,
  });

  const updateSearchParams = useCallback((updater: (next: URLSearchParams) => void) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      updater(next);
      return next;
    });
  }, [setSearchParams]);

  const handleKeywordChange = useCallback((value: string) => {
    const nextQ = value.trim();
    setKeywordInput(value);

    updateSearchParams((next) => {
      setParamOrDelete(next, 'q', nextQ);
      next.delete("page");
    });
  }, [updateSearchParams]);

  const handleStarsChange = useCallback((value: StarsSelectValue) => {
    const nextStars = value === ALL_STARS_OPTION ? '' : value;

    updateSearchParams((next) => {
      setParamOrDelete(next, 'stars', nextStars);
      next.delete("page");
    });
  }, [updateSearchParams]);

  const handleLoadMore = useCallback(() => {
    updateSearchParams((next) => {
      next.set("page", String(page + 1));
    });
  }, [page, updateSearchParams]);

  // Conditionally render feed, or loading/error states
  const reviewSection = useMemo(() => {
    if (isInitialLoading) return <ReviewsSkeleton />;
    if (error) return <ReviewsError />;
    if (!loading && reviews.length === 0) return <ReviewsNotFound />;

    return (
      <ErrorBoundary fallback={<ReviewsRenderError />}>
        <ReviewsFeed reviews={reviews} />
      </ErrorBoundary>
    );
  }, [isInitialLoading, error, loading, reviews]);

  return (
    <main className="container mx-auto p-4">
      <h1>Reviews for ChatGPT</h1>

      <SearchFilters
        keywordValue={keywordInput}
        onKeywordChange={e => handleKeywordChange(e.target.value)}
        starsValue={stars || ALL_STARS_OPTION}
        onStarsChange={handleStarsChange}
      />

      {reviewSection}

      {reachedEndOfList && reviews.length > 0 && !error && (
        <p className="text-center text-sm text-muted-foreground py-2">
          No more reviews to load.
        </p>
      )}

      <LoadMoreButton
        loading={loading}
        disabled={reachedEndOfList && reviews.length > 0}
        className='mx-auto my-2'
        onClick={handleLoadMore}
      />
    </main>
  )
}

export default App
