type DataResult = {
    id: string;
    title: string;
    subtitle: any
}

export class SearchState {
    #input = $state("");
    #isLoading = $state(false);
    #searchResults: DataResult[] = $state([]);
    #selectedItem: DataResult | null = $state(null);

    get input() {
        return this.#input;
    }
    set input(value) {
        this.#input = value;
    }

    get isLoading() {
        return this.#isLoading;
    }
    set isLoading(value) {
        this.#isLoading = value;
    }

    get searchResults() {
        return this.#searchResults;
    }
    set searchResults(value: DataResult[]) {
        this.#searchResults = value;
    }

    get selectedItem() {
        return this.#selectedItem;
    }
    set selectedItem(value: DataResult | null) {
        this.#selectedItem = value;
    }

    clearResults() {
        this.#input = "";
        this.#isLoading = false;
        this.#searchResults = [];
    }

    clearSelectedItem() {
        this.#selectedItem = null;
    }

    clearAll() {
        this.clearResults();
        this.clearSelectedItem();
    }
}