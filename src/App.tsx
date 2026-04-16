import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LoadMoreButton } from "@/components/load-more-button"
import { ReviewsFeed } from "@/components/reviews-feed"
import {
  ReviewsSkeleton,
  ReviewsError,
  ReviewsNotFound
} from "@/components/reviews-placeholder"
import { SearchFilters } from "@/components/search-filters"
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch"
import './styles/index.css'

const BASE_REQUEST_URL = import.meta.env.VITE_BASE_REQUEST_URL;

type ReviewItem = {
  id: string;
  stars: string;
  title: string;
  review: string;
  author: string;
  date: string;
};

type ReviewsResponse = {
  reviews: ReviewItem[];
};

async function fetchReviews(endpoint: string, signal: AbortSignal): Promise<ReviewsResponse> {
  const res = await fetch(endpoint, { signal })
  if (!res.ok) throw new Error("Failed to fetch starss");
  return res.json();
}

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loadedFilterKey, setLoadedFilterKey] = useState<string | null>(null);

  const q = useMemo(() => searchParams.get('q')?.trim() ?? '', [searchParams]);
  const stars = useMemo(() => {
    const value = searchParams.get('stars') ?? '';
    return ['1', '2', '3', '4', '5'].includes(value) ? value : '';
  }, [searchParams]);
  const page = useMemo(() => {
    const pageQuery = Number.parseInt(searchParams.get('page') ?? '', 10);
    return Number.isInteger(pageQuery) && pageQuery > 0 ? pageQuery : 1;
  }, [searchParams]);
  const filterKey = useMemo(() => `${q}|${stars}`, [q, stars]);
  const isInitialLoading = loadedFilterKey !== filterKey;
  const [keywordInput, setKeywordInput] = useState(q);

  useEffect(() => {
    setKeywordInput(q);
  }, [q]);

  useEffect(() => {
    const next = new URLSearchParams();

    if (q) next.set("q", q);
    if (stars) next.set("stars", stars);
    if (page > 1) next.set("page", page.toString());

    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [q, stars, page, searchParams, setSearchParams]);

  const endpoint = useMemo(() => {
    const DEFAULT_PER_PAGE = 25;
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
  }, [q, stars, page, isInitialLoading]);

  const handleSuccess = useCallback((next: ReviewsResponse) => {
    const nextReviews = next.reviews ?? [];

    setReviews((prev) => (isInitialLoading || page === 1 ? nextReviews : [...prev, ...nextReviews]));
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

  const reviewSection = useMemo(() => {
    if (isInitialLoading) return <ReviewsSkeleton />;
    if (error) return <ReviewsError />;
    if (!loading && reviews.length === 0) return <ReviewsNotFound />;
    return <ReviewsFeed reviews={reviews} />;
  }, [isInitialLoading, error, loading, reviews]);

  return (
    <main className="container mx-auto p-4">
      <h1>Reviews</h1>

      <SearchFilters
        keywordValue={keywordInput}
        onKeywordChange={e => {
          const nextKeywordInput = e.target.value;
          const nextQ = nextKeywordInput.trim();
          setKeywordInput(nextKeywordInput);

          updateSearchParams((next) => {
            if (nextQ) next.set("q", nextQ);
            else next.delete("q");
            next.delete("page");
          });
        }}
        starsValue={stars || 'all'}
        onStarsChange={value => {
          const nextStars = value === 'all' ? '' : String(value);

          updateSearchParams((next) => {
            if (nextStars) next.set("stars", nextStars);
            else next.delete("stars");
            next.delete("page");
          });
        }}
      />

      {reviewSection}

      <LoadMoreButton
        loading={loading}
        className='mx-auto my-2'
        onClick={() => {
          updateSearchParams((next) => {
            next.set("page", String(page + 1));
          });
        }}
      />
    </main>
  )
}

export default App
