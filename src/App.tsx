import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LoadMoreButton } from "@/components/load-more-button"
import Review from "@/components/review"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import './styles/index.css'

const reviewData = {
  "author": "angiemacc",
  "title": "Photo cleaning",
  "review": "I love how this refreshes my photos",
  "original_title": "Photo cleaning",
  "original_review": "I love how this refreshes my photos",
  "stars": "5.00",
  "iso": "GB",
  "version": null,
  "date": "2026-04-14T15:44:31",
  "deleted": false,
  "has_response": false,
  "product": 336744124021,
  "product_id": 336744124021,
  "product_name": "ChatGPT",
  "vendor_id": "6448311069",
  "store": "apple",
  "weight": 8,
  "id": "336744124021L5OnsyoDYyhxKK-X9tleVxg",
  "predicted_langs": [
    "en"
  ]
};

function App() {
  const reviews = [reviewData, reviewData, reviewData];

  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState(searchParams.get('q'));
  const [rating, setRating] = useState(searchParams.get('rating'));
  const [page, setPage] = useState<number>(() => {
    const parsed = Number.parseInt(searchParams.get('page') ?? '');
    return Number.isNaN(parsed) ? 1 : parsed;
  });

  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (q?.trim()) next.set("q", q.trim());
      else next.delete("q");

      if (rating) next.set("rating", rating);
      else next.delete("rating");

      if (page) next.set("page", page.toString());
      else next.delete("page");

      return next;
    });
  }, [q, rating, page, setSearchParams]);

  return (
    <main className="container mx-auto p-4">
      <h1>Reviews</h1>

      <form className="flex flex-row justify-between my-4">
        <Input
          value={q}
          placeholder="Filter by Keyword"
          type="text"
          className="w-1/4"
          onChange={event => setQ(event.target.value)}
        />
        <Select
          defaultValue={rating ?? ''}
          onValueChange={value => setRating(value)}
        >
          <SelectTrigger className="w-1/4">
            <SelectValue placeholder="Filter by Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={null}>Filter by Rating</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </form>

      <section className='flex flex-col gap-2 border-1 rounded-sm p-2'>
        {reviews.map((review, i) => (
          <Review
            key={`${review?.date}-${i}`}
            stars={review?.stars}
            title={review?.title}
            review={review?.review}
            author={review?.author}
            date={review?.date}
          />
        ))}
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
