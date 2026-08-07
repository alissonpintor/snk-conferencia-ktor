import TableHeader from "$components/display/data-grid/table/table-header.svelte";
import TableRowActions from "$components/display/data-grid/table/table-row-actions.svelte";
import { renderComponent } from "$components/display/data-table/render-helpers"
import type { ColumnDef } from "@tanstack/table-core";
import type { Separacao } from "$lib/types/separacao";
import { modalState } from "./modal-state.svelte";
import { alertState } from "$lib/states/notification.svelte";

async function gerarVolumes(separacao: Separacao) {
    modalState.separacao = separacao;
    await modalState.showModal();
}

async function imprimirVolumes(separacao: Separacao) {
    const response = await fetch(
        '/api/conferencia/volumes/imprimir',
        {
            method: 'POST',
            body: JSON.stringify({
                nroUnico: separacao.nroUnico,
                nroSeparacao: separacao.nroSeparacao
            })
        }
    )
    const data = await response.blob();
    const blobUrl = URL.createObjectURL(data);
    window.open(blobUrl);
}

async function enviarParaDoca(separacao: Separacao) {
    const { nroConferencia, nroNota, ordemCarga, enviadoParaDoca } = separacao;

    if (!nroConferencia || !nroNota || !ordemCarga) {
        return;
    }

    if (enviadoParaDoca === 'Sim') {
        alertState.setAlert(
            "Conferência já enviada para doca",
            `A Conferência ${nroConferencia} já foi enviada para doca.`
        )
        return;
    }

    const response = await fetch(
        '/api/conferencia/doca',
        {
            method: 'POST',
            body: JSON.stringify({
                nroConferencia,
                nroNota,
                ordemCarga
            })
        }
    )

    const { success, error } = await response.json();

    if (success) {
        alertState.setAlert(
            "Enviado para doca",
            `Conferência ${nroConferencia} enviada para doca com sucesso`
        )
    } else {
        alertState.setAlert(
            "Erro ao enviar para doca",
            error.message
        )
    }
}


async function cancelarConferencia(separacao: Separacao) {
    const STATUS_PERMITIDOS_CANCELAMENTO = [12, 6];

    if (!separacao) { return; }
    const { nroConferencia, codSit } = separacao;
    if (!nroConferencia && !codSit) { return; }

    console.log(nroConferencia, codSit, STATUS_PERMITIDOS_CANCELAMENTO.every(s => s !== codSit));

    if (STATUS_PERMITIDOS_CANCELAMENTO.every(s => s !== Number(codSit))) {
        alertState.setAlert(
            "Cancelamento não permitido",
            'Somente conferencias "Aguardando recontagem", "Conferencia com divergencia" e "Aguardando Conferência de Volumes" podem ser canceladas.',
        )
        return;
    }

    const response = await fetch(
        `/api/conferencia/cancelar`,
        {
            method: 'POST',
            body: JSON.stringify({
                nroConferencia
            })
        }
    )

    const { success, error } = await response.json();

    if (success) {
        alertState.setAlert(
            "Conferência cancelada",
            `Conferência ${nroConferencia} cancelada com sucesso`
        )
    } else {
        alertState.setAlert(
            "Erro ao tentar cancelar a conferência",
            error.message
        )
    }
}

import { dateRangeFilter, numberRangeFilter, multiSelectFilter, dateHourRangeFilter } from "$lib/utils/table-filters";

export const columnsSeparacao: ColumnDef<Separacao>[] = [
    {
        id: 'actions',
        accessorKey: "nroSeparacao",
        size: 50,
        enableHiding: false,
        header: "",
        cell: ({ row }) => renderComponent(TableRowActions, {
            actions: [
                {
                    text: "Imprimir Volumes", action: () => imprimirVolumes(row.original)
                },
                {
                    text: "Gerar Volumes", action: () => gerarVolumes(row.original)
                },
                {
                    text: "Enviar para Doca", action: () => enviarParaDoca(row.original)
                },
                {
                    text: "Cancelar Conferência", action: () => cancelarConferencia(row.original)
                },
            ]
        }),
    },
    {
        id: "Nro. Separação",
        accessorKey: "nroSeparacao",
        size: 150,
        filterFn: numberRangeFilter,
        meta: { filterVariant: 'number' },
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Nro.Sep.",
            toogle: column.getIsSorted(),
            table: table,
            column: column,
            onclick: column.getToggleSortingHandler(),
        }),
    },
    {
        id: "Nro. Único",
        accessorKey: "nroUnico",
        size: 150,
        filterFn: numberRangeFilter,
        meta: { filterVariant: 'number' },
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Nro. Único",
            toogle: column.getIsSorted(),
            table: table,
            column: column,
            onclick: column.getToggleSortingHandler(),
        }),
    },
    {
        accessorKey: "nomeParc",
        filterFn: "includesString",
        meta: { filterVariant: 'text' },
        enableResizing: true,
        size: 350,
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
        filterFn: numberRangeFilter,
        meta: { filterVariant: 'number' },
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Ord.Carga",
            toogle: column.getIsSorted(),
            table: table,
            column: column,
            onclick: column.getToggleSortingHandler(),
        }),
    },
    {
        accessorKey: "tipoEntrega",
        size: 170,
        meta: {
            filterVariant: 'select',
            filterOptions: [
                { label: "Retira", value: "Retira" },
                { label: "Transportadora", value: "Transportadora" },
                { label: "Praça", value: "Praça" },
                { label: "Entrega", value: "Entrega" }
            ]
        },
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Tp.Entrega",
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
        filterFn: dateHourRangeFilter,
        meta: { filterVariant: 'date-hour' },
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
        filterFn: multiSelectFilter,
        meta: {
            filterVariant: 'select',
            filterOptions: [
                { label: "Aguardando Separação", value: "Aguardando Separação" },
                { label: "Enviado para Separação", value: "Enviado para Separação" },
                { label: "Em Processo de Separação", value: "Em Processo de Separação" },
                { label: "Aguardando Conferência", value: "Aguardando Conferência" },
                { label: "Em Processo de Conferência", value: "Em Processo de Conferência" },
                { label: "Conferência com Divergência", value: "Conferência com Divergência" },
                { label: "Aguardando Recontagem", value: "Aguardando Recontagem" },
                { label: "Aguardando Conferência de Volumes", value: "Aguardando Conferência de Volumes" },
                { label: "Conferência Validada", value: "Conferência Validada" },
                { label: "Concluído", value: "Concluído" },
                { label: "Cancelada", value: "Cancelada" },
                { label: "Possui Retorno de Mercadoria", value: "Possui Retorno de Mercadoria" }
            ]
        },
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
        filterFn: numberRangeFilter,
        meta: { filterVariant: 'number' },
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Nro.Conf.",
            toogle: column.getIsSorted(),
            onclick: column.getToggleSortingHandler(),
            table: table,
            column: column,
        }),
    },
    {
        accessorKey: "enviadoParaDoca",
        size: 150,
        filterFn: multiSelectFilter,
        meta: {
            filterVariant: 'select',
            filterOptions: [
                { label: "Sim", value: "Sim" },
                { label: "Não", value: "Não" }
            ]
        },
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Enviado.Doca",
            toogle: column.getIsSorted(),
            onclick: column.getToggleSortingHandler(),
            table: table,
            column: column,
        }),
    },
    {
        accessorKey: "nomeConf",
        size: 200,
        meta: { filterVariant: 'text' },
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
        filterFn: numberRangeFilter,
        meta: { filterVariant: 'number' },
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
        meta: { filterVariant: 'text' },
        header: ({ column, table }) => renderComponent(TableHeader, {
            text: "Área Sep.",
            toogle: column.getIsSorted(),
            onclick: column.getToggleSortingHandler(),
            table: table,
            column: column,
        }),
    },
];

