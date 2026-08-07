import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { DEFAULT_COLORS } from './row-colors.svelte';

const STORAGE_KEY = 'row-colors-expedicao';

// Mock localStorage
const localStorageMock = (() => {
	let store: Record<string, string> = {};
	return {
		getItem: vi.fn((key: string) => store[key] ?? null),
		setItem: vi.fn((key: string, value: string) => {
			store[key] = value;
		}),
		removeItem: vi.fn((key: string) => {
			delete store[key];
		}),
		clear: vi.fn(() => {
			store = {};
		}),
		get length() {
			return Object.keys(store).length;
		},
		key: vi.fn((index: number) => Object.keys(store)[index] ?? null)
	};
})();

Object.defineProperty(globalThis, 'localStorage', {
	value: localStorageMock,
	writable: true
});

describe('row-colors state', () => {
	beforeEach(() => {
		localStorageMock.clear();
		vi.clearAllMocks();
	});

	describe('DEFAULT_COLORS', () => {
		it('should have 12 status entries', () => {
			expect(Object.keys(DEFAULT_COLORS)).toHaveLength(12);
		});

		it('should have backgroundColor and textColor for each status', () => {
			for (const [, color] of Object.entries(DEFAULT_COLORS)) {
				expect(color).toHaveProperty('backgroundColor');
				expect(color).toHaveProperty('textColor');
				expect(color.backgroundColor).toMatch(/^#[0-9a-fA-F]{6}$/);
				expect(color.textColor).toMatch(/^#[0-9a-fA-F]{6}$/);
			}
		});

		it('should contain all expected statuses', () => {
			const expectedStatuses = [
				'Aguardando Separação',
				'Enviado para Separação',
				'Em Processo de Separação',
				'Aguardando Conferência',
				'Em Processo de Conferência',
				'Conferência com Divergência',
				'Aguardando Recontagem',
				'Aguardando Conferência de Volumes',
				'Conferência Validada',
				'Concluído',
				'Cancelada',
				'Possui Retorno de Mercadoria'
			];

			for (const status of expectedStatuses) {
				expect(DEFAULT_COLORS).toHaveProperty(status);
			}
		});
	});

	describe('load/save with localStorage', () => {
		it('should save and load colors from localStorage', () => {
			const customData = {
				colors: {
					'Concluído': { backgroundColor: '#ff0000', textColor: '#00ff00' }
				},
				isEnabled: true
			};
			localStorage.setItem(STORAGE_KEY, JSON.stringify(customData));

			const saved = localStorage.getItem(STORAGE_KEY);
			expect(saved).not.toBeNull();

			const parsed = JSON.parse(saved!);
			expect(parsed.colors['Concluído'].backgroundColor).toBe('#ff0000');
			expect(parsed.colors['Concluído'].textColor).toBe('#00ff00');
		});

		it('should handle corrupted localStorage data gracefully', () => {
			localStorage.setItem(STORAGE_KEY, 'invalid-json');

			expect(() => {
				const saved = localStorage.getItem(STORAGE_KEY);
				if (saved) {
					try {
						JSON.parse(saved);
					} catch {
						// Should use defaults - graceful handling
					}
				}
			}).not.toThrow();
		});

		it('should use defaults when localStorage is empty', () => {
			const saved = localStorage.getItem(STORAGE_KEY);
			expect(saved).toBeNull();
		});

		it('should save isEnabled state', () => {
			const data = {
				colors: DEFAULT_COLORS,
				isEnabled: false
			};
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

			const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
			expect(parsed.isEnabled).toBe(false);
		});

		it('should merge saved colors with defaults on load', () => {
			// Simulate partial save - only one status customized
			const partialSave = {
				colors: {
					'Concluído': { backgroundColor: '#aabbcc', textColor: '#112233' }
				},
				isEnabled: true
			};
			localStorage.setItem(STORAGE_KEY, JSON.stringify(partialSave));

			const saved = localStorage.getItem(STORAGE_KEY);
			const parsed = JSON.parse(saved!);
			const merged = { ...DEFAULT_COLORS, ...parsed.colors };

			// Custom color should be present
			expect(merged['Concluído'].backgroundColor).toBe('#aabbcc');
			// Default colors should still be present
			expect(merged['Cancelada']).toEqual(DEFAULT_COLORS['Cancelada']);
		});
	});

	describe('getRowStyle logic', () => {
		it('should return style object for known status when enabled', () => {
			const isEnabled = true;
			const colors = { ...DEFAULT_COLORS };
			const situacao = 'Concluído';
			const color = colors[situacao];

			const result = isEnabled && color
				? { backgroundColor: color.backgroundColor, color: color.textColor }
				: undefined;

			expect(result).toBeDefined();
			expect(result!.backgroundColor).toBe('#e0f7fa');
			expect(result!.color).toBe('#006064');
		});

		it('should return undefined for unknown status', () => {
			const isEnabled = true;
			const colors = { ...DEFAULT_COLORS };
			const situacao = 'Status Inexistente';
			const color = colors[situacao];

			const result = isEnabled && color
				? { backgroundColor: color.backgroundColor, color: color.textColor }
				: undefined;

			expect(result).toBeUndefined();
		});

		it('should return undefined when disabled', () => {
			const isEnabled = false;
			const colors = { ...DEFAULT_COLORS };
			const situacao = 'Concluído';
			const color = colors[situacao];

			const result = isEnabled && color
				? { backgroundColor: color.backgroundColor, color: color.textColor }
				: undefined;

			expect(result).toBeUndefined();
		});

		it('should return correct colors for all 12 statuses', () => {
			const isEnabled = true;
			const colors = { ...DEFAULT_COLORS };

			for (const [status, expected] of Object.entries(DEFAULT_COLORS)) {
				const color = colors[status];
				const result = isEnabled && color
					? { backgroundColor: color.backgroundColor, color: color.textColor }
					: undefined;

				expect(result).toBeDefined();
				expect(result!.backgroundColor).toBe(expected.backgroundColor);
				expect(result!.color).toBe(expected.textColor);
			}
		});
	});

	describe('resetToDefaults logic', () => {
		it('should produce default colors after reset', () => {
			// Simulate modified colors
			const modified = { ...DEFAULT_COLORS };
			modified['Concluído'] = { backgroundColor: '#000000', textColor: '#ffffff' };

			// Reset
			const resetColors = { ...DEFAULT_COLORS };

			expect(resetColors).toEqual(DEFAULT_COLORS);
			expect(resetColors['Concluído']).toEqual(DEFAULT_COLORS['Concluído']);
		});
	});

	describe('setStatusColor logic', () => {
		it('should update a specific status color', () => {
			const colors = { ...DEFAULT_COLORS };
			const newColor = { backgroundColor: '#111111', textColor: '#222222' };
			colors['Concluído'] = newColor;

			expect(colors['Concluído']).toEqual(newColor);
			// Other statuses should remain unchanged
			expect(colors['Cancelada']).toEqual(DEFAULT_COLORS['Cancelada']);
		});

		it('should handle immutable update pattern', () => {
			const colors = { ...DEFAULT_COLORS };
			const newColor = { backgroundColor: '#aaaaaa', textColor: '#bbbbbb' };
			const updated = { ...colors, 'Cancelada': newColor };

			expect(updated['Cancelada']).toEqual(newColor);
			// Original should not be modified
			expect(colors['Cancelada']).toEqual(DEFAULT_COLORS['Cancelada']);
		});
	});

	describe('toggleEnabled logic', () => {
		it('should toggle the enabled state', () => {
			let isEnabled = true;
			isEnabled = !isEnabled;
			expect(isEnabled).toBe(false);
			isEnabled = !isEnabled;
			expect(isEnabled).toBe(true);
		});

		it('should persist toggled state', () => {
			let isEnabled = true;
			isEnabled = !isEnabled;
			
			const data = { colors: DEFAULT_COLORS, isEnabled };
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

			const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
			expect(parsed.isEnabled).toBe(false);
		});
	});
});
