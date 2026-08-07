export type StatusColor = {
	backgroundColor: string;
	textColor: string;
};

export type StatusColorMap = Record<string, StatusColor>;

export const DEFAULT_COLORS: StatusColorMap = {
	'Aguardando Separação': { backgroundColor: '#fff3e0', textColor: '#e65100' },
	'Enviado para Separação': { backgroundColor: '#e3f2fd', textColor: '#0d47a1' },
	'Em Processo de Separação': { backgroundColor: '#e8eaf6', textColor: '#1a237e' },
	'Aguardando Conferência': { backgroundColor: '#fff8e1', textColor: '#f57f17' },
	'Em Processo de Conferência': { backgroundColor: '#f3e5f5', textColor: '#4a148c' },
	'Conferência com Divergência': { backgroundColor: '#fce4ec', textColor: '#b71c1c' },
	'Aguardando Recontagem': { backgroundColor: '#fbe9e7', textColor: '#bf360c' },
	'Aguardando Conferência de Volumes': { backgroundColor: '#e0f2f1', textColor: '#004d40' },
	'Conferência Validada': { backgroundColor: '#e8f5e9', textColor: '#1b5e20' },
	'Concluído': { backgroundColor: '#e0f7fa', textColor: '#006064' },
	'Cancelada': { backgroundColor: '#efebe9', textColor: '#3e2723' },
	'Possui Retorno de Mercadoria': { backgroundColor: '#fce4ec', textColor: '#880e4f' }
};

const STORAGE_KEY = 'row-colors-expedicao';

function createRowColorsState() {
	let colors = $state<StatusColorMap>({ ...DEFAULT_COLORS });
	let isEnabled = $state<boolean>(true);

	return {
		get colors() {
			return colors;
		},
		get isEnabled() {
			return isEnabled;
		},

		setColors(newColors: StatusColorMap) {
			colors = { ...newColors };
			this.save();
		},

		setStatusColor(status: string, color: StatusColor) {
			colors = { ...colors, [status]: color };
			this.save();
		},

		setEnabled(value: boolean) {
			isEnabled = value;
			this.save();
		},

		toggleEnabled() {
			isEnabled = !isEnabled;
			this.save();
		},

		resetToDefaults() {
			colors = { ...DEFAULT_COLORS };
			this.save();
		},

		getRowStyle(situacao: string): Record<string, string> | undefined {
			if (!isEnabled) return undefined;
			const color = colors[situacao];
			if (!color) return undefined;
			return {
				backgroundColor: color.backgroundColor,
				color: color.textColor
			};
		},

		load() {
			if (typeof window === 'undefined') return;
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				try {
					const parsed = JSON.parse(saved);
					colors = { ...DEFAULT_COLORS, ...parsed.colors };
					isEnabled = parsed.isEnabled ?? true;
				} catch {
					/* usa defaults */
				}
			}
		},

		save() {
			if (typeof window === 'undefined') return;
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({
					colors,
					isEnabled
				})
			);
		}
	};
}

export const rowColorsState = createRowColorsState();
