/**
 * Cria uma versão "debounced" de uma função que atrasa sua execução
 * até que um determinado tempo tenha passado sem que ela seja chamada novamente.
 * É totalmente tipada para preservar a assinatura da função original.
 *
 * @param func A função que você quer "debounce".
 * @param delay O tempo de espera em milissegundos.
 * @returns A nova função "debounced" com os mesmos tipos de parâmetros e retorno.
 */
export function debounce<T extends (...args: any[]) => void>(func: T, delay: number = 300): (this: ThisParameterType<T>, ...args: Parameters<T>) => void {
  // O tipo de retorno de setTimeout pode ser 'number' (no navegador) ou 'NodeJS.Timeout' (no Node.js).
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  // A função retornada terá exatamente os mesmos parâmetros que a função original 'func'.
  // 'Parameters<T>' extrai os tipos dos parâmetros de 'T'.
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    // Captura o contexto 'this' da chamada, preservando o tipo original.
    const context = this;

    // Limpa o timeout anterior sempre que a função é chamada para reiniciar o cronômetro.
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Define um novo timeout.
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}