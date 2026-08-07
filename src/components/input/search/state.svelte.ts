export type DataResult = {
    id: string;
    title: string;
    subtitle: string
}

export class SearchState<T> {
    #setInput: (value: string | null) => void;
    searchInput = $state("");
    isLoading = $state(false);
    searchResults: DataResult[] = $state([]);
    #selectedItem: DataResult | null = $state(null);

    constructor(setInput: (value: string | null) => void) {
        this.#setInput = setInput;
    }

    get selectedItem() {
        return this.#selectedItem;
    }

    set selectedItem(value: DataResult | null) {
        this.#setInput(value ? value.id : null);
        this.#selectedItem = value;
    }

    clearResults() {
        this.#setInput(null);
        this.clearAll();
    }

    clearSelectedItem() {
        this.#selectedItem = null;
    }

    clearAll() {
        this.isLoading = false;
        this.searchInput = "";
        this.searchResults = [];
        this.clearSelectedItem();
    }
}