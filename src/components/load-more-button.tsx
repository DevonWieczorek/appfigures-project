import { type FC } from 'react';
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

type LoadMoreButtonProps = {
	loading: boolean;
	onClick: () => void;
	className?: string;
}

export const LoadMoreButton: FC<LoadMoreButtonProps> = ({
	loading = false,
	onClick,
	className = ''
}) => (
	<Button
		variant="default"
		size="lg"
		disabled={loading}
		className={className}
		onClick={onClick}
	>
		{loading ? 'Loading' : 'Load More'}
		{loading && <Spinner data-icon="inline-start" />}
	</Button>
);