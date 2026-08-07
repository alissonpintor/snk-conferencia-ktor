export type PaginationProps = {
	hasPreviousPage: () => boolean;
	hasNextPage: () => boolean;
	previousPage: () => void;
	nextPage: () => void;
	setPageSize: (page: number) => void;
	pageCount: () => number;
	pageIndex: number;
	pageSize: number;
};

export type CounterProps = {
	count: number;
	isLoading: boolean;
};

export type SelectColumnsProps = {
	isAllColumnsVisible: () => boolean;
	toggleAllColumnsVisibility: (e: any) => any;
	setColumnOrder?: (e: any) => any;
	getAllColumns: () => any[];
	getSavedColumnOrder?: () => any;
	saveColumnOrder?: (columns: any[]) => void;
	resetColumnOrder?: (e: any) => any;
	onConfigureColors?: () => void;
};

export type PanelProps = {
	title: string;
	counter: CounterProps;
	pagination: PaginationProps;
	selectColumns: SelectColumnsProps;
};
