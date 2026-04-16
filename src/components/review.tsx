
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
	<article className="review-container">
		<Rating value={parseInt(stars)} />
		<h3>{title}</h3>
		<p>{review}</p>
		<footer className='review-footer'>
			<div>{author}</div>
			<time dateTime={date}>{date}</time>
		</footer>
	</article>
);

export default Review;