import { describe, it, expect } from 'vitest';
import { dateRangeFilter, dateHourRangeFilter, numberRangeFilter, multiSelectFilter } from './table-filters';

describe('table-filters', () => {
	const mockRow = (value: any) =>
		({
			getValue: () => value
		}) as any;

	describe('dateRangeFilter', () => {
		it('should return true if no filter is applied', () => {
			expect(dateRangeFilter(mockRow(new Date()), 'col', [null, null], () => { })).toBe(true);
		});

		it('should filter correctly within range', () => {
			const start = new Date('2023-01-01T00:00:00');
			const end = new Date('2023-01-31T23:59:59');
			const dateInRange = new Date('2023-01-15T12:00:00');
			const dateBefore = new Date('2022-12-31T23:59:59');
			const dateAfter = new Date('2023-02-01T00:00:00');

			expect(dateRangeFilter(mockRow(dateInRange), 'col', [start, end], () => { })).toBe(true);
			expect(dateRangeFilter(mockRow(dateBefore), 'col', [start, end], () => { })).toBe(false);
			expect(dateRangeFilter(mockRow(dateAfter), 'col', [start, end], () => { })).toBe(false);
		});


		it('should handle strings as dates', () => {
			const start = new Date('2023-01-01T00:00:00');
			const end = new Date('2023-01-31T23:59:59');

			expect(dateRangeFilter(mockRow('2023-01-15'), 'col', [start, end], () => { })).toBe(true);
			expect(dateRangeFilter(mockRow('2023-02-15'), 'col', [start, end], () => { })).toBe(false);
		});

		it('should handle BR date strings', () => {
			const start = new Date('2023-01-01T00:00:00');
			const end = new Date('2023-01-31T23:59:59');

			expect(dateRangeFilter(mockRow('15/01/2023'), 'col', [start, end], () => { })).toBe(true);
			expect(dateRangeFilter(mockRow('15/02/2023'), 'col', [start, end], () => { })).toBe(false);
		});
	});

	describe('dateHourRangeFilter', () => {
		it('should filter correctly with exact hours and minutes', () => {
			const start = new Date('2023-01-01T10:00:00');
			const end = new Date('2023-01-01T11:00:59');

			// Exact match
			expect(dateHourRangeFilter(mockRow(new Date('2023-01-01T10:00:00')), 'col', [start, end], () => { })).toBe(true);
			expect(dateHourRangeFilter(mockRow(new Date('2023-01-01T11:00:59')), 'col', [start, end], () => { })).toBe(true);

			// Inside range
			expect(dateHourRangeFilter(mockRow(new Date('2023-01-01T10:30:00')), 'col', [start, end], () => { })).toBe(true);

			// Just outside range
			expect(dateHourRangeFilter(mockRow(new Date('2023-01-01T09:59:59')), 'col', [start, end], () => { })).toBe(false);
			expect(dateHourRangeFilter(mockRow(new Date('2023-01-01T11:01:00')), 'col', [start, end], () => { })).toBe(false);
		});

		it('should handle BR date strings with time', () => {
			const start = new Date('2023-01-01T10:00:00');
			const end = new Date('2023-01-01T11:00:59');

			expect(dateHourRangeFilter(mockRow('01/01/2023 10:30:00'), 'col', [start, end], () => { })).toBe(true);
			expect(dateHourRangeFilter(mockRow('01/01/2023 09:30:00'), 'col', [start, end], () => { })).toBe(false);
			expect(dateHourRangeFilter(mockRow('01/01/2023 11:30:00'), 'col', [start, end], () => { })).toBe(false);
		});
	});

	describe('numberRangeFilter', () => {
		it('should return true if no filter is applied', () => {
			expect(numberRangeFilter(mockRow(10), 'col', [null, null], () => { })).toBe(true);
		});

		it('should filter correctly within range', () => {
			expect(numberRangeFilter(mockRow(10), 'col', [5, 15], () => { })).toBe(true);
			expect(numberRangeFilter(mockRow(5), 'col', [5, 15], () => { })).toBe(true);
			expect(numberRangeFilter(mockRow(15), 'col', [5, 15], () => { })).toBe(true);
			expect(numberRangeFilter(mockRow(4), 'col', [5, 15], () => { })).toBe(false);
			expect(numberRangeFilter(mockRow(16), 'col', [5, 15], () => { })).toBe(false);
		});
	});

	describe('multiSelectFilter', () => {
		it('should return true if no filter is applied', () => {
			expect(multiSelectFilter(mockRow('A'), 'col', [], () => { })).toBe(true);
			expect(multiSelectFilter(mockRow('A'), 'col', null, () => { })).toBe(true);
		});

		it('should filter correctly', () => {
			expect(multiSelectFilter(mockRow('A'), 'col', ['A', 'B'], () => { })).toBe(true);
			expect(multiSelectFilter(mockRow('C'), 'col', ['A', 'B'], () => { })).toBe(false);
		});
	});
});
