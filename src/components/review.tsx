
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
		<Rating value={parseInt(stars)} className='justify-end' />
		<h3>{title}</h3>
		<p className='py-2'>{review}</p>
		<footer className='review-footer'>
			<div>{author}</div>
			<time dateTime={date}>
				{/* TODO: add date formatting */}
				{date}
			</time>
		</footer>
	</article>
);

export default Review;