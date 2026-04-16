export type ReviewItem = {
  id: string;
  stars: string;
  title: string;
  review: string;
  author: string;
  date: string;
};

export type ReviewsResponse = {
  reviews: ReviewItem[];
};

export type GroupedReviews = {
  label: string;
  items: ReviewItem[];
};
