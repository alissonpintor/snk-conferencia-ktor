/**
 * Pausa a execução por um determinado tempo.
 * @param ms Tempo em milissegundos para aguardar.
 * @returns Uma Promise que resolve após o tempo especificado.
 */
export const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};
