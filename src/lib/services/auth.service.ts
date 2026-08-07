import { TREINA_URL, PROD_URL } from '$env/static/private';
import type { AuthCredentials, UserSession } from '$lib/types/auth';

export class AuthService {
    async login(credentials: AuthCredentials): Promise<UserSession> {
        const baseUrl = credentials.server === 'producao' ? PROD_URL : TREINA_URL;

        // Service name and output type parameters
        // Using strict URL construction to match existing pattern if needed
        const url = `${baseUrl}/mge/service.sbr?serviceName=MobileLoginSP.login&outputType=json`;

        const body = {
            serviceName: "MobileLoginSP.login",
            requestBody: {
                NOMUSU: { "$": credentials.username },
                INTERNO: { "$": credentials.password },
                KEEPCONNECTED: { "$": "S" }
            }
        };

        let response: Response;
        try {
            response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Adding User-Agent or other headers if necessary, 
                    // though Sankhya typically just needs Content-Type and correct body.
                },
                body: JSON.stringify(body)
            });
        } catch (error) {
            throw new Error("Erro de conexão com o servidor Sankhya.");
        }

        if (response.status !== 200) {
            throw new Error(`Erro na API Sankhya: ${response.status} ${response.statusText}`);
        }

        // Handle legacy encoding (windows-1252)
        const buffer = await response.arrayBuffer();
        const decoder = new TextDecoder('windows-1252');
        const text = decoder.decode(buffer);

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            throw new Error("Resposta inválida do servidor Sankhya (JSON malformado).");
        }

        if (data.status !== "1") {
            // Sankhya returns status "0" for error
            throw new Error(data.statusMessage || "Erro desconhecido no login.");
        }

        const { responseBody } = data;
        if (!responseBody || !responseBody.jsessionid) {
            throw new Error("Resposta do servidor incompleta (jsessionid ausente).");
        }

        // Safe decoding of ID if available
        let idusuStr = "0";
        if (responseBody.idusu && responseBody.idusu.$) {
            try {
                idusuStr = atob(responseBody.idusu.$);
            } catch (e) {
                console.warn('Falha ao decodificar idusu base64', e);
                idusuStr = responseBody.idusu.$; // Fallback
            }
        }

        console.log(responseBody.jsessionid.$, idusuStr, credentials.username);

        return {
            jsessionid: responseBody.jsessionid.$,
            idusu: idusuStr,
            nomeusu: credentials.username, // Returning input username as confirmed by existing logic
            server: credentials.server
        };
    }
}
