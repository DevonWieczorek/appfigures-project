import { useMemo, type FC } from 'react';
import { Review } from "@/components/review"
import { groupReviews } from '@/lib/utils';
import type { ReviewsResponse } from "@/types/reviews"

export const ReviewsFeed: FC<ReviewsResponse> = ({ reviews }) => {
	const groupedReviews = useMemo(() => groupReviews(reviews), [reviews]);

	return (
		<section id="reviews">
			{groupedReviews?.length > 0 && (
				<>
					<div className="py-2">Showing {reviews.length} reviews:</div>
					<div className="space-y-8">
						{groupedReviews.map((group) => (
							<div key={group.label} className="space-y-3">
								<h2 className="text-center">{group.label}</h2>

								<div className="reviews-wrapper space-y-4">
									{group.items.map((review) => (
										<Review
											key={review.id}
											stars={review.stars}
											title={review.title}
											review={review.review}
											author={review.author}
											date={review.date}
										/>
									))}
								</div>
							</div>
						))}
					</div>
				</>
			)}
		</section>
	);
}