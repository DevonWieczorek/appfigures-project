import type { FC, ChangeEvent } from 'react';
import { Input } from "@/components/ui/input"
import { ALL_STARS_OPTION, STARS_VALUES, type StarsSelectValue } from "@/types/filters"
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
	starsValue: StarsSelectValue;
	onStarsChange: (value: StarsSelectValue) => void;
};

export const SearchFilters: FC<SearchFiltersProps> = ({
	keywordValue = '',
	onKeywordChange = () => { },
	starsValue = ALL_STARS_OPTION,
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
					<SelectItem value={ALL_STARS_OPTION}>Filter by Rating</SelectItem>
					{STARS_VALUES.map((value) => (
						<SelectItem key={value} value={value}>{value}</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	</form>
);