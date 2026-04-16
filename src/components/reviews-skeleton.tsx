import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonText() {
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


export const ReviewsSkeleton = ({ count = 4 }) => (
	<section id="loading-reviews">
		<div className="space-y-8">
			<div className="space-y-3">

				<div className="reviews-wrapper space-y-4">
					{Array(count).fill('').map(() => (
						<SkeletonText />
					))}
				</div>
			</div>
		</div>
	</section>
);