import { Skeleton } from "@/components/ui/skeleton"
import { StatePanel } from "@/components/state-panel";

export const SkeletonText = () => {
	return (
		<div className="content-panel">
			<div className="flex w-full max-w-xs flex-col gap-2">
				<Skeleton className="h-4 w-full bg-muted-foreground" />
				<Skeleton className="h-4 w-full bg-muted-foreground" />
				<Skeleton className="h-4 w-3/4 bg-muted-foreground" />
			</div>
		</div>
	)
}

export const ReviewsNotFound = () => (
	<StatePanel id="no-reviews" innerClassName="py-4 text-center">
		<h3>Wow, you really know what you want huh?</h3>
		There are no results based on the filter criteria you provided.
		You should never settle, but maybe loosen your search criteria and try again.
	</StatePanel>
);

export const ReviewsError = () => (
	<StatePanel id="reviews-error" innerClassName="py-4 text-center error">
		<h3>It's not you, it's us.</h3>
		There was an error fetching your reviews. Please refresh the page and try again.
	</StatePanel>
);

export const ReviewsRenderError = () => (
	<StatePanel id="reviews-render-error" innerClassName="py-4 text-center error">
		<h3>It's not you, it's us.</h3>
		There was an error showing your reviews. Please refresh the page and try again.
	</StatePanel>
);

export const ReviewsSkeleton = ({ count = 4 }) => (
	<StatePanel id="loading-reviews">
		{Array.from({ length: count }, (_, i) => i + 1).map((_, index) => (
			<SkeletonText key={index} />
		))}
	</StatePanel>
);