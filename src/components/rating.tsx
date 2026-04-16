import { type FC } from 'react';
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type RatingProps = {
	value: number;
	max?: number;
	className?: string;
};

export const Rating: FC<RatingProps> = ({ value, max = 5, className }) => {
	return (
		<div className={cn("flex items-center gap-1", className)}>
			{Array.from({ length: max }).map((_, i) => {
				const filled = i < Math.round(value);
				return (
					<Star
						key={i}
						className={cn(
							"h-4 w-4",
							filled ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
						)}
					/>
				);
			})}
		</div>
	);
}