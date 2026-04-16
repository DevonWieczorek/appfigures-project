import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils";

export const SkeletonText = () => {
	return (
		<div className="review-container">
			<div className="flex w-full max-w-xs flex-col gap-2">
				<Skeleton className="h-4 w-full bg-muted-foreground" />
				<Skeleton className="h-4 w-full bg-muted-foreground" />
				<Skeleton className="h-4 w-3/4 bg-muted-foreground" />
			</div>
		</div>
	)
}

export const ReviewsPlaceholder = ({ id, innerClassName = '', children }) => (
	<section id={id}>
		<div className="space-y-8">
			<div className="space-y-3">
				<div className={cn(
					"reviews-wrapper space-y-4",
					innerClassName
				)}>
					{children}
				</div>
			</div>
		</div>
	</section>
);

export const ReviewsNotFound = () => (
	<ReviewsPlaceholder id="no-reviews" innerClassName="py-4 text-center">
		There are no results based on the filter criteria you provided.
	</ReviewsPlaceholder>
);

export const ReviewsError = () => (
	<ReviewsPlaceholder id="reviews-error" innerClassName="py-4 text-center error">
		There was an error fetching your reviews. Please refresh the page and try again.
	</ReviewsPlaceholder>
);

export const ReviewsSkeleton = ({ count = 4 }) => (
	<ReviewsPlaceholder id="loading-reviews">
		{Array.from({ length: count }, (_, i) => i + 1).map((_, index) => (
			<SkeletonText key={index} />
		))}
	</ReviewsPlaceholder>
);