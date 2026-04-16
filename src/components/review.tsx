
import { type FC } from 'react';
import { Rating } from "@/components/rating"

type ReviewProps = {
	stars: string;
	title: string;
	review: string;
	author: string;
	date: string;
}

const Review: FC<ReviewProps> = ({
	stars,
	title,
	review,
	author,
	date
}) => (
	<div className="review-container">
		<Rating value={parseInt(stars)} />
		<div>{title}</div>
		<div>{review}</div>
		<div className='review-footer'>
			<div>{author}</div>
			<div>{date}</div>
		</div>
	</div>
);

export default Review;