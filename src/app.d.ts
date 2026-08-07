// See https://svelte.dev/docs/kit/types#app.d.ts
import type { Usuario } from "$lib/types/usuario";

import '@tanstack/table-core'

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			sankhyaServer: string | null;
			sankhyaSessionId: string | null;
			usuario: Usuario | null;
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '@tanstack/table-core' {
	interface ColumnMeta<TData extends import('@tanstack/table-core').RowData, TValue> {
		filterVariant?: 'text' | 'number' | 'date' | 'date-hour' | 'select' | 'boolean';
		filterOptions?: { label: string; value: any }[];
	}
}

export { };

