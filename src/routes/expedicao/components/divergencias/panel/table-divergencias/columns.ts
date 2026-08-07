import TableHeader from "$components/display/data-grid/table/table-header.svelte";
import TableRowActions from "$components/display/data-grid/table/table-row-actions.svelte";
import { renderComponent } from "$components/display/data-table/render-helpers"
import type { ColumnDef } from "@tanstack/table-core";
import type { Divergencia} from '$lib/types/divergencia'


export const columnsDivergencia: ColumnDef<Divergencia>[] = [
    {
        id: 'actions',
        accessorKey: "nroSeparacao",
        size: 50,
        enableHiding: false,
        header: "",
        cell: () => renderComponent(TableRowActions, {
            actions: []
        }),
    },
    {
        id: "Nro. Separação",
        accessorKey: "nroSeparacao",
        size: 150,
        filterFn: "equals",
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Nro.Sep.",
            toogle: column.getIsSorted(),
            table: table,
            column: column,
            onclick: column.getToggleSortingHandler(),
        }),
    },
    {
        accessorKey: "nomeParc",
        size: 500,
        filterFn: "includesString",
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Parceiro",
            toogle: column.getIsSorted(),
            table: table,
            column: column,
            onclick: column.getToggleSortingHandler(),
        }),
    },
    {
        accessorKey: "ordemCarga",
        size: 150,
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Ord.Carga",
            toogle: column.getIsSorted(),
            table: table,
            column: column,
            onclick: column.getToggleSortingHandler(),
        }),
    },
    {
        accessorKey: "dataSeparacao",
        size: 200,
        sortingFn: 'datetime',
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Dt.Separação",
            toogle: column.getIsSorted(),
            table: table,
            column: column,
            onclick: column.getToggleSortingHandler(),
        }),
    },
    {
        accessorKey: "situacao",
        size: 300,
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Situação",
            toogle: column.getIsSorted(),
            onclick: column.getToggleSortingHandler(),
            table: table,
            column: column,
        }),
    },
    {
        accessorKey: "nroConferencia",
        size: 150,
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Nro.Conf.",
            toogle: column.getIsSorted(),
            onclick: column.getToggleSortingHandler(),
            table: table,
            column: column,
        }),
    },
    {
        accessorKey: "nomeConf",
        size: 200,
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Conferente",
            toogle: column.getIsSorted(),
            onclick: column.getToggleSortingHandler(),
            table: table,
            column: column,
        }),
    },
    {
        accessorKey: "codArea",
        size: 100,
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Cod.Área",
            toogle: column.getIsSorted(),
            onclick: column.getToggleSortingHandler(),
            table: table,
            column: column,
        }),
    },
    {
        accessorKey: "areaSeparacao",
        size: 250,
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Área Sep.",
            toogle: column.getIsSorted(),
            onclick: column.getToggleSortingHandler(),
            table: table,
            column: column,
        }),
    },
];
