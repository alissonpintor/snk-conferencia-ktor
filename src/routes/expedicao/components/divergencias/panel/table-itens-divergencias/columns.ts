import TableCell from "./table-cell.svelte";
import CellTratativa from "./cell-tratativa.svelte";
import CellMotivo from "./cell-motivo.svelte";
import TableSelect from "./table-select.svelte";
import { renderComponent } from "$components/display/data-table/render-helpers";
import type { ColumnDef } from "@tanstack/table-core";
import type { Produto } from '$lib/types/divergencia';


export const columnsItensDivergencia: ColumnDef<Produto>[] = [
    {
        id: 'select',
        size: 50,
        header: ({ table }) => {
            return renderComponent(TableSelect, {
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onchange: table.getToggleAllRowsSelectedHandler(),
            })
        },
        cell: ({ row }) => {
            return renderComponent(TableSelect, {
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                onchange: row.getToggleSelectedHandler(),
            })
        },
    },
    {
        accessorKey: "tratativa",
        header: "Tratativa",
        size: 80,
        cell: ( { row } ) => renderComponent(CellTratativa, {
            row,
            setValue: (value: number) => {
                row.original.tratativa = value;
            }
        })
    },
    {
        accessorKey: "motivo",
        header: "Motivo",
        size: 300,
        cell: ( { row } ) => renderComponent(CellMotivo, {
            row,
            setValue: (value: number) => {
                row.original.motivo = value;
            }
        })
    },
    {
        accessorKey: "codigo",
        size: 80,
        header: ({ column, table }) => renderComponent(TableCell, {
            text: "Cod.Prod.",
            toogle: column.getIsSorted(),
            table: table,
            column: column,
            onclick: column.getToggleSortingHandler(),
        }),
    },
    {
        accessorKey: "descricao",
        size: 500,
        header: ({ column, table }) => renderComponent(TableCell, {
            text: "Descrição",
            toogle: column.getIsSorted(),
            table: table,
            column: column,
            onclick: column.getToggleSortingHandler(),
        }),
    },
    {
        accessorKey: "codigoBarras",
        size: 200,
        header: ({ column, table }) => renderComponent(TableCell, {
            text: "Cod. Barras",
            toogle: column.getIsSorted(),
            table: table,
            column: column,
            onclick: column.getToggleSortingHandler(),
        }),
    },
    {
        accessorKey: "unidade",
        size: 100,
        header: ({ column, table }) => renderComponent(TableCell, {
            text: "Und.",
            toogle: column.getIsSorted(),
            onclick: column.getToggleSortingHandler(),
            table: table,
            column: column,
        }),
    },
    {
        accessorKey: "qtdade",
        size: 100,
        header: ({ column, table }) => renderComponent(TableCell, {
            text: "Qtd.Neg.",
            toogle: column.getIsSorted(),
            onclick: column.getToggleSortingHandler(),
            table: table,
            column: column,
        }),
    },
    {
        accessorKey: "qtdConferida",
        size: 100,
        header: ({ column, table }) => renderComponent(TableCell, {
            text: "Qtd.Conf.",
            toogle: column.getIsSorted(),
            onclick: column.getToggleSortingHandler(),
            table: table,
            column: column,
        }),
    },
    {
        accessorKey: "descricaoMotivo",
        size: 300,
        header: ({ column, table }) => renderComponent(TableCell, {
            text: "Motivo",
            toogle: column.getIsSorted(),
            onclick: column.getToggleSortingHandler(),
            table: table,
            column: column,
        }),
    },
];
