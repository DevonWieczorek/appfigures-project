import type { FC, ChangeEvent } from 'react';
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

type SearchFiltersProps = {
	keywordValue: string;
	onKeywordChange: (e: ChangeEvent<HTMLInputElement>) => void;
	// starsValue: "1" | "2" | "3" | "4" | "5" | "" | "all";
	starsValue: string;
	onStarsChange: (value: string) => void;
};

export const SearchFilters: FC<SearchFiltersProps> = ({
	keywordValue = '',
	onKeywordChange = () => { },
	starsValue = 'all',
	onStarsChange = () => { }
}) => (
	<form className="flex flex-row justify-between my-4">
		<Input
			value={keywordValue}
			placeholder="Filter by Keyword"
			type="text"
			className="w-1/4 rounded-sm"
			onChange={onKeywordChange}
		/>
		<Select
			value={starsValue}
			onValueChange={onStarsChange}
		>
			<SelectTrigger className="w-1/4 rounded-sm">
				<SelectValue placeholder="Filter by Rating" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectItem value="all">Filter by Rating</SelectItem>
					<SelectItem value="1">1</SelectItem>
					<SelectItem value="2">2</SelectItem>
					<SelectItem value="3">3</SelectItem>
					<SelectItem value="4">4</SelectItem>
					<SelectItem value="5">5</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	</form>
);