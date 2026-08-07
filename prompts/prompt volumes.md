Quando é finalizado a a conferencia o usuario informa a quantidade de volumes que deseja imprimir e confirma no componente @registrar-volume.svelte que chama o endpoint da api em /src/routes/api/registrar-volumes/+server.ts

Esse endpoint por sua vez faz uma chamada para a api da Sankhya que faz o registro do volume. Logo após isso e chamado /src/routes/api/registrar-volumes/imprimir/+server.ts que solicita a geração da etiqueta de volume pela api do Sankhya. o Problema é que as vezes o Sankhya ainda está processando o registro do volume e não consegue gerar a etiqueta e retorna o erro similar ao exemplo abaixo:

{
    serviceName: 'MgeWmsSP.enviaConferenciaPedidosParaDoca',
    status: '0',
    pendingPrinting: 'false',
    transactionId: '02E5A9F6B58D72CA68E3AA6730084E57',
    tsError: { tsErrorCode: 'WMS_E00144', tsErrorLevel: 'ERROR' },
    statusMessage: "Há etiquetas para a separação '1010596' ainda não impressas. Imprima-as antes de continuar."
}

Implemente uma solução de retry para caso a api da Sankhya retorne algum erro, refaça a chamada até 3 vezes com um intervalo de n*2 segundos onde n e o numero da tentativa entre as chamadas.