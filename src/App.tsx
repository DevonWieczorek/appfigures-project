import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LoadMoreButton } from "@/components/load-more-button"
import { Review } from "@/components/review"
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

async function fetchStars(endpoint: string, signal: AbortSignal): Promise<ReviewsResponse> {
  const res = await fetch(endpoint, { signal })
  if (!res.ok) throw new Error("Failed to fetch starss");
  return res.json();
}

function App() {
  // TODO: implement a distinction between loading more and loading a fresh set of reviews
  // TODO: page 2 initial load will get 25 reviews, where as clicking from 1 -> 2 will have 50

  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get('q') ?? '');
  const [stars, setStars] = useState(searchParams.get('stars') ?? '');
  const [page, setPage] = useState<number>(() => {
    const pageQuery = parseInt(searchParams.get('page'));
    return Number.isInteger(pageQuery) && pageQuery > 0 ? pageQuery : 1
  });
  const [reviews, setReviews] = useState<ReviewItem[]>([]);

  const endpoint = useMemo(() => {
    const params = new URLSearchParams();
    const safeQ = q.trim();
    const safeStars = ['1', '2', '3', '4', '5'].includes(stars) ? stars : '';
    const safePage = Number.isInteger(page) && page > 0 ? page : 1;

    if (safeQ) params.set("q", safeQ);
    if (safeStars) params.set("stars", safeStars);
    params.set("page", safePage.toString());

    return `${BASE_REQUEST_URL}?${params.toString()}`;
  }, [q, stars, page]);

  const handleSuccess = useCallback((next: ReviewsResponse) => {
    if (!next.reviews?.length) return;
    setReviews((prev) => (page === 1 ? next.reviews : [...prev, ...next.reviews]));
  }, [page]);

  const { loading } = useDebouncedSearch({
    endpoint,
    delay: 350,
    enabled: true,
    fetcher: fetchStars,
    onSuccess: handleSuccess,
  });

  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const safeQ = q.trim();
      const safeStars = ['1', '2', '3', '4', '5'].includes(stars) ? stars : '';
      const safePage = Number.isInteger(page) && page > 0 ? page : 1;

      if (safeQ) next.set("q", safeQ);
      else next.delete("q");

      if (safeStars) next.set("stars", safeStars);
      else next.delete("stars");

      if (safePage > 1) next.set("page", safePage.toString());

      return next;
    });
  }, [q, stars, page, setSearchParams]);

  return (
    <main className="container mx-auto p-4">
      <h1>Reviews</h1>

      <SearchFilters
        keywordValue={q}
        onKeywordChange={e => {
          setQ(e.target.value);
          setPage(1);
        }}
        starsValue={stars || 'all'}
        onStarsChange={value => {
          const nextStars = value === 'all' ? '' : String(value);
          setStars(nextStars);
          setPage(1);
        }}
      />

      <section id='reviews'>
        {reviews?.length > 0 && (
          <>
            <div className='py-2'>Showing {reviews.length} reviews:</div>
            <div className='reviews-wrapper'>
              {reviews?.map((review) => (
                <Review
                  key={review?.id}
                  stars={review?.stars}
                  title={review?.title}
                  review={review?.review}
                  author={review?.author}
                  date={review?.date}
                />
              ))}
            </div>
          </>
        )}
      </section>

      <LoadMoreButton
        loading={loading}
        className='mx-auto my-2'
        onClick={() => setPage(page + 1)}
      />
    </main>
  )
}

export default App
