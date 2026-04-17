export const STARS_VALUES = ['1', '2', '3', '4', '5'] as const;
export const ALL_STARS_OPTION = 'all' as const;

export type StarsValue = typeof STARS_VALUES[number];
export type StarsSelectValue = StarsValue | typeof ALL_STARS_OPTION;

export type ReviewsQueryParams = {
  q: string;
  stars: StarsValue | '';
  page: number;
};

export type ReviewsEndpointParams = ReviewsQueryParams & {
  isInitialLoading: boolean;
};
