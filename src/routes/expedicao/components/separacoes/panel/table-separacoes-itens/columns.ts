import TableHeader from "$components/display/data-grid/table/table-header.svelte";
import TableRowActions from "$components/display/data-grid/table/table-row-actions.svelte";
import { renderComponent } from "$components/display/data-table/render-helpers"
import type { ColumnDef } from "@tanstack/table-core";
import type { Produto } from "$lib/types/separacao";
import CellCopy from "./cell-copy.svelte";


import { dateRangeFilter, numberRangeFilter, multiSelectFilter } from "$lib/utils/table-filters";

export const columnsSeparacaoItens: ColumnDef<Produto>[] = [
    {
        id: 'actions',
        accessorKey: "produtos",
        size: 50,
        enableHiding: false,
        header: "",
        cell: () => renderComponent(TableRowActions, {
            actions: []
        }),
    },
    {
        accessorKey: "codProduto",
        size: 100,
        filterFn: numberRangeFilter,
        meta: { filterVariant: 'number' },
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Cod.",
            toogle: column.getIsSorted(),
            table: table,
            column: column,
            onclick: column.getToggleSortingHandler(),
        }),
    },
    {
        accessorKey: "descricaoProduto",
        size: 540,
        meta: { filterVariant: 'text' },
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Descrição",
            toogle: column.getIsSorted(),
            table: table,
            column: column,
            onclick: column.getToggleSortingHandler(),
        }),
    },
    {
        accessorKey: "marca",
        size: 150,
        meta: { filterVariant: 'text' },
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Marca",
            toogle: column.getIsSorted(),
            table: table,
            column: column,
            onclick: column.getToggleSortingHandler(),
        }),
    },
    {
        accessorKey: "codBarras",
        size: 150,
        meta: { filterVariant: 'text' },
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Cod. Barras",
            toogle: column.getIsSorted(),
            table: table,
            column: column,
            onclick: column.getToggleSortingHandler(),
        }),
        cell: ({ cell }) => renderComponent(CellCopy, { value: cell.getValue() })
    },
    {
        accessorKey: "referencia",
        size: 150,
        meta: { filterVariant: 'text' },
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Referência",
            toogle: column.getIsSorted(),
            table: table,
            column: column,
            onclick: column.getToggleSortingHandler(),
        }),
    },
    {
        accessorKey: "unidade",
        size: 100,
        meta: { filterVariant: 'text' },
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Und.",
            toogle: column.getIsSorted(),
            table: table,
            column: column,
            onclick: column.getToggleSortingHandler(),
        }),
    },
    {
        accessorKey: "quantidade",
        size: 100,
        filterFn: numberRangeFilter,
        meta: { filterVariant: 'number' },
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Qtdade.",
            toogle: column.getIsSorted(),
            table: table,
            column: column,
            onclick: column.getToggleSortingHandler(),
        }),
    },
    {
        accessorKey: "endOrigem",
        size: 210,
        meta: { filterVariant: 'text' },
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "End.Origem",
            toogle: column.getIsSorted(),
            table: table,
            column: column,
            onclick: column.getToggleSortingHandler(),
        }),
    },
    {
        accessorKey: "endDestino",
        size: 210,
        meta: { filterVariant: 'text' },
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "End.Destino",
            toogle: column.getIsSorted(),
            table: table,
            column: column,
            onclick: column.getToggleSortingHandler(),
        }),
    },
    {
        accessorKey: "usuario",
        size: 150,
        meta: { filterVariant: 'text' },
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Usuário",
            toogle: column.getIsSorted(),
            table: table,
            column: column,
            onclick: column.getToggleSortingHandler(),
        }),
    },
    {
        accessorKey: "situacao",
        size: 160,
        filterFn: multiSelectFilter,
        meta: { 
            filterVariant: 'select',
            filterOptions: [
                { label: "Pendente", value: "Pendente" },
                { label: "Em Separação", value: "Em Separação" },
                { label: "Concluido", value: "Concluido" }
            ]
        },
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Situação",
            toogle: column.getIsSorted(),
            table: table,
            column: column,
            onclick: column.getToggleSortingHandler(),
        }),
    },
    {
        accessorKey: "dtHrInicial",
        size: 210,
        sortingFn: 'datetime',
        filterFn: dateRangeFilter,
        meta: { filterVariant: 'date' },
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Dt.Hr.Inicial",
            toogle: column.getIsSorted(),
            table: table,
            column: column,
            onclick: column.getToggleSortingHandler(),
        }),
        cell: ({cell}) => {
            const date = cell.getValue<string>();
            if (date) return new Date(date).toLocaleString();
            return '';
        }
    },
    {
        accessorKey: "dtHrFinal",
        size: 210,
        sortingFn: 'datetime',
        filterFn: dateRangeFilter,
        meta: { filterVariant: 'date' },
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Dt.Hr.Final",
            toogle: column.getIsSorted(),
            table: table,
            column: column,
            onclick: column.getToggleSortingHandler(),
        }),
        cell: ({cell}) => {
            const date = cell.getValue<string>();
            if (date) return new Date(date).toLocaleString();
            return '';
        }
    },
];

