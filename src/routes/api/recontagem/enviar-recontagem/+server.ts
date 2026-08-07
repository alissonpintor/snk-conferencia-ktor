import { json } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {
	const { nroConferencia, nroTarefa, codigoBarras, quantidade, sequencia } = await request.json();

	if (!nroConferencia || !nroTarefa || !codigoBarras || !quantidade || !sequencia) {
		return json(
			{
				success: false,
				error: [
					{
						title: 'Erro ao registrar conferência do produto',
						message: 'O nro da coferencia, codigo de barras e quantidade são obrigatórios.'
					}
				],
				data: null
			},
			{
				status: 400
			}
		);
	}

	try {
		const SERVICE_NAME = 'serviceName=MgeWmsSP.envioRecontagem';
		const MGE_SESSION = `mgeSession=${locals.sankhyaSessionId}`;
		const OUTPUT_TYPE = 'outputType=json';

		// <requestBody>
		// 		<idusu>OTE=</idusu>
		// 		<NUCONFERENCIA>979306</NUCONFERENCIA>
		// 		<SEQUENCIA>1</SEQUENCIA>
		// 		<NUTAREFA>1660559</NUTAREFA>
		// 		<CODBARRAS>7891595007078</CODBARRAS>
		// 		<QUANTIDADE>24.0</QUANTIDADE>
		// 		<FUNCAORECPECA>false</FUNCAORECPECA>
		// 		<QTDPECAS>0</QTDPECAS>
		// 		<TIPOREC>NORMAL</TIPOREC>
		// 		<QTDAVARIA>0</QTDAVARIA>
		// 		<CONTROLE> </CONTROLE>
		// 		<DTVAL></DTVAL>
		// 		<UTILIZAEXPLOTE>false</UTILIZAEXPLOTE>
		// 		<CODBARRASCONCATWMS></CODBARRASCONCATWMS>
		// 		<PRIMEIRARECONTAGEM>false</PRIMEIRARECONTAGEM>
		// 		<RECRIAVOLPOSREC>false</RECRIAVOLPOSREC>
		// </requestBody>
		const response = await fetch(
			`${locals.sankhyaServer}/mgewms/service.sbr?${SERVICE_NAME}&${MGE_SESSION}&${OUTPUT_TYPE}`,
			{
				method: 'POST',
				headers: {
					Cookie: `JSESSIONID=${locals.sankhyaSessionId}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					serviceName: 'MgeWmsSP.envioRecontagem',
					requestBody: {
						idusu: {
							$: btoa(locals.usuario!.id.toString())
						},
						NUCONFERENCIA: {
							$: nroConferencia
						},
						NUTAREFA: {
							$: nroTarefa
						},
						CODBARRAS: {
							$: codigoBarras
						},
						SEQUENCIA: {
							$: sequencia
						},
						QUANTIDADE: {
							$: quantidade
						},
						FUNCAORECPECA: {
							$: false
						},
						QTDPECAS: {
							$: 0
						},
						TIPOREC: {
							$: 'NORMAL'
						},
						QTDAVARIA: {
							$: 0
						},
						CONTROLE: {
							$: ' '
						},
						DTVAL: {
							$: ''
						},
						UTILIZAEXPLOTE: {
							$: false
						},
						CODBARRASCONCATWMS: {
							$: ''
						},
						RECRIAVOLPOSREC: {
							$: false
						},
						PRIMEIRARECONTAGEM: {
							$: false
						}
					}
				})
			}
		);

		const buffer = await response.arrayBuffer();
		const decoder = new TextDecoder('iso-8859-1');
		const jsonDecoded = decoder.decode(buffer);

		const responseData = JSON.parse(jsonDecoded);
		const { status } = responseData;
		const errors = [];

		console.log(responseData);

		if (Number(status) !== 1) {
			const { statusMessage } = responseData;
			console.log(responseData);
			errors.push({
				title: 'Erro ao registrar conferência do produto',
				message: statusMessage
			});

			return json(
				{
					success: false,
					error: errors,
					data: null
				},
				{
					status: 400
				}
			);
		}

		const data = responseData.responseBody.entity.linhas.linha;
		if(data.MENSAGEM !== 'OK') {
			return json(
				{
					success: false,
					error: [
						{
							title: 'Erro ao registrar conferência do produto',
							message: data.MENSAGEM
						}
					],
					data: null
				},
				{
					status: 400
				}
			)
		}

		return json({
			success: true,
			error: null,
			data: data
		});
	} catch (error) {
		if (error instanceof Error) {
			return json(
				{
					success: false,
					error: [{ title: 'Erro ao registrar conferência do produto', message: error.message }],
					data: null
				},
				{
					status: 500
				}
			);
		}
	}

	return json({});
};
