import type { Table, ColumnDef } from "@tanstack/table-core"


interface RowAction {
    text: string;
    action: () => Promise<void>
}

abstract class Teste {
    abstract getName(): void
}

interface DataGridState<TData, TFilter> {
    data: TData[];
    filter: TFilter;
    isDataLoading: boolean;
    table: Table<TData>;
    columns: ColumnDef<TData>;
    rowActions?: RowAction[]
    getData: (filter: TFilter) => void;
}

class DataGrid<TData, TFilter>  implements DataGridState<TData, TFilter> {
    constructor(data: TData[], filter: TFilter) {
        data = data;
        filter = filter;
    }
    data: TData[];
    filter: TFilter;
    isDataLoading: boolean;
    table: Table<TData>;
    columns: ColumnDef<TData>;
    rowActions?: RowAction[] | undefined;
    getData: (filter: TFilter) => void;
}

function createDatagridState<TFilter>(filter: TFilter): DataGridState<TData, TFilter>{

}