
import { type FC, useMemo } from 'react';
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { Rating } from "@/components/rating"
import type { ReviewItem } from "@/types/reviews"

type ReviewProps = Pick<ReviewItem, 'stars' | 'title' | 'review' | 'author' | 'date'>

export const Review: FC<ReviewProps> = ({
	stars,
	title,
	review,
	author,
	date
}) => {
	dayjs.extend(relativeTime)

	const formattedDate = useMemo(() => {
		return dayjs(date).fromNow()
	}, [date]);

	return (
		<article className="review-container">
			<Rating value={parseInt(stars)} className='justify-end' />
			<h3>{title}</h3>
			<p className='py-2'>{review}</p>
			<footer className='review-footer'>
				<div>{author}</div>
				<time dateTime={date}>
					{formattedDate}
				</time>
			</footer>
		</article>
	);
};