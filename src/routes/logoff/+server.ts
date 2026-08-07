import { json } from '@sveltejs/kit';

export async function GET({ cookies, locals }) {
        const SESSION_ID = cookies.get('SessionID');    
        const errors = [];
        try {
            const SERVICE_NAME = 'serviceName=MobileLoginSP.logout';
            const MGE_SESSION = `mgeSession=${SESSION_ID}`
            const OUTPUT_TYPE = 'outputType=json';

            const response = await fetch(`${locals.sankhyaServer}/mge/service.sbr?${SERVICE_NAME}&${MGE_SESSION}&${OUTPUT_TYPE}`, {
                method: 'GET',
                headers: {
					Cookie: `JSESSIONID=${SESSION_ID}`
				},
            });

            // O Sankhya usa um encode legado e precisa fazer a conversão
            const buffer = await response.arrayBuffer();
            const decoder = new TextDecoder('windows-1252'); 
            const jsonDecoded = decoder.decode(buffer);

            const responseData = JSON.parse(jsonDecoded);
            const { status } = responseData;

            if (Number(status) !== 1) {
                const { statusMessage } = responseData;
                errors.push({
                    title: 'Erro ao tentar fazer logoff',
                    message: statusMessage
                });

                return json({})
            }

            console.log(responseData);
            const { responseBody } = responseData;
        } catch (error) {
            errors.push({
                title: 'Erro ao tentar fazer logoff',
                message: error
            });
            return json({})
        }

        cookies.delete('SessionID', {
            path: '/'
        });

        cookies.delete('Usuario', {
            path: '/'
        });

        return json({
            success: true,
            errors: null,
            data: []
        })
}
