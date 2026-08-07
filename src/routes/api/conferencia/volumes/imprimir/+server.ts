import { json } from '@sveltejs/kit';
import { LoadView, sankhyaApiClient } from '$lib/sankhya-client/client.js';
import { ViewAppSeparacao } from '$lib/sankhya-client/views/view-separacao';
import type { Separacao } from '$lib/types/separacao';
import { sleep } from '$lib/utils/sleep';
import templateHtml from '../../../../../../static/templates/reports/etiqueta-volume/template.html?raw';
import cardHtml from '../../../../../../static/templates/reports/etiqueta-volume/card.html?raw';
import { USUARIO_SANKHYA, PASSWORD_SANKHYA } from '$env/static/private';


// Helper function to execute raw SQL queries via DbExplorerSP.executeQuery
async function executeQuery<T>(
    sql: string,
    sankhyaServer: string,
    sankhyaSessionId: string
): Promise<T[]> {
    const body = JSON.stringify({
        serviceName: 'DbExplorerSP.executeQuery',
        requestBody: {
            sql
        }
    });

    const response = await sankhyaApiClient.post(
        sankhyaServer,
        body,
        sankhyaSessionId,
        'DbExplorerSP.executeQuery'
    );

    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder('windows-1252');
    const jsonDecoded = decoder.decode(buffer);

    let responseData;
    try {
        responseData = JSON.parse(jsonDecoded);
    } catch (e) {
        console.error('[executeQuery] Erro ao parsear JSON:', jsonDecoded);
        throw new Error('Resposta do servidor inválida');
    }

    if (Number(responseData.status) !== 1) {
        throw new Error(responseData.statusMessage || 'Erro ao executar consulta SQL no Sankhya');
    }

    const { fieldsMetadata, rows } = responseData.responseBody;
    
    if (!rows || !Array.isArray(rows)) {
        return [];
    }

    const columns = fieldsMetadata.map((f: any) => f.name.toUpperCase());
    const result: T[] = [];
    
    for (const row of rows) {
        const item: any = {};
        for (let i = 0; i < columns.length; i++) {
            item[columns[i]] = row[i];
        }
        result.push(item as T);
    }

    return result;
}

// Format Date/Time helper
function formatDateTime(dhinc: string | undefined | null): string {
    if (!dhinc) {
        return new Date().toLocaleString('pt-BR');
    }
    if (typeof dhinc === 'string' && dhinc.includes('/') && dhinc.includes(':')) {
        return dhinc;
    }
    try {
        const date = new Date(dhinc);
        if (!isNaN(date.getTime())) {
            return date.toLocaleString('pt-BR');
        }
    } catch (e) {
        // ignore
    }
    return dhinc;
}

// Sankhya Admin Login Helper
async function sankhyaLogin(sankhyaServer: string): Promise<string> {
    const url = `${sankhyaServer}/mge/service.sbr?serviceName=MobileLoginSP.login&outputType=json`;
    const body = {
        serviceName: "MobileLoginSP.login",
        requestBody: {
            NOMUSU: { "$": USUARIO_SANKHYA },
            INTERNO: { "$": PASSWORD_SANKHYA },
            KEEPCONNECTED: { "$": "S" }
        }
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error(`Falha na API de login: ${response.status} ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    const decoder = new TextDecoder('windows-1252');
    const text = decoder.decode(buffer);
    const data = JSON.parse(text);

    if (Number(data.status) !== 1) {
        throw new Error(data.statusMessage || "Erro ao efetuar login no ERP.");
    }

    return data.responseBody.jsessionid.$;
}

// Sankhya Admin Logout Helper
async function sankhyaLogout(sankhyaServer: string, sessionId: string): Promise<void> {
    const url = `${sankhyaServer}/mge/service.sbr?serviceName=MobileLoginSP.logout&mgeSession=${sessionId}&outputType=json`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Cookie: `JSESSIONID=${sessionId}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            const buffer = await response.arrayBuffer();
            const decoder = new TextDecoder('windows-1252');
            const text = decoder.decode(buffer);
            const data = JSON.parse(text);
            console.log('[ImprimirVolumes] Logoff da sessão de consulta efetuado. Status:', data.status);
        }
    } catch (e) {
        console.error('[ImprimirVolumes] Erro ao executar logoff no Sankhya:', e);
    }
}

export async function POST({ request, locals }) {
    const { nroUnico, nroSeparacao } = await request.json();

    if (!nroUnico || !nroSeparacao) {
        return json({
            success: false,
            error: [{
                title: 'Erro ao tentar imprimir os volumes',
                message: 'O número único e número de separação são obrigatórios.'
            }],
            data: null
        }, { status: 400 });
    }

    let adminSessionId: string | null = null;

    try {
        // 1. Fetch separation data using active user session
        const viewSeparacao = new ViewAppSeparacao();
        viewSeparacao.addExpression(`NUSEPARACAO = ${Number(nroSeparacao)}`);

        const loadView = new LoadView(locals.sankhyaServer!, locals.sankhyaSessionId!);
        const responseData = await loadView.get<Separacao>(viewSeparacao);
        
        const records = responseData.responseBody.records;
        const hasData = records && Object.keys(records).length > 0;
        
        if (!hasData) {
            return json({
                success: false,
                error: [{
                    title: 'Separação não encontrada',
                    message: `Não foi encontrada nenhuma separação com número ${nroSeparacao}.`
                }],
                data: null
            }, { status: 404 });
        }

        const record = Array.isArray(records.record) ? records.record[0] : records.record;
        const separacao = viewSeparacao.getData(record);
        const codParc = separacao.codParc;

        // 2. Authenticate admin user for queries
        adminSessionId = await sankhyaLogin(locals.sankhyaServer!);

        // 3. Query partner full address info from TGFPAR using admin session
        const partnerSql = `
            SELECT 
                par.RAZAOSOCIAL,
                par.TELEFONE,
                par.CEP,
                par.NUMEND,
                par.COMPLEMENTO,
                endr.NOMEEND,
                endr.TIPO AS TIPOEND,
                bai.NOMEBAI,
                cid.NOMECID,
                ufs.UF AS UF_SIGLA
            FROM TGFPAR par
            LEFT JOIN TSIEND endr ON par.CODEND = endr.CODEND
            LEFT JOIN TSIBAI bai ON par.CODBAI = bai.CODBAI
            LEFT JOIN TSICID cid ON par.CODCID = cid.CODCID
            LEFT JOIN TSIUFS ufs ON cid.UF = ufs.CODUF
            WHERE par.CODPARC = ${Number(codParc)}
        `;

        interface PartnerInfo {
            RAZAOSOCIAL: string;
            TELEFONE?: string;
            CEP?: string;
            NUMEND?: string;
            COMPLEMENTO?: string;
            NOMEEND?: string;
            TIPOEND?: string;
            NOMEBAI?: string;
            NOMECID?: string;
            UF_SIGLA?: string;
        }

        const partners = await executeQuery<PartnerInfo>(partnerSql, locals.sankhyaServer!, adminSessionId);
        const partner = partners && partners.length > 0 ? partners[0] : null;

        const razaoSocial = partner?.RAZAOSOCIAL || separacao.nomeParc || '';
        const telefone = partner?.TELEFONE || '';
        const cep = partner?.CEP || '';
        const numEnd = partner?.NUMEND || '';
        const complemento = partner?.COMPLEMENTO || '';
        const nomeEnd = partner?.NOMEEND || '';
        const tipoEnd = partner?.TIPOEND || '';
        const nomeBai = partner?.NOMEBAI || '';
        const nomeCid = partner?.NOMECID || '';
        const ufSigla = partner?.UF_SIGLA || '';

        // 4. Query volumes from TGWREV with a retry polling loop using admin session
        const volumesSql = `
            SELECT IDREV, SEQETIQUETA, DHINC 
            FROM TGWREV 
            WHERE NUSEPARACAO = ${Number(nroSeparacao)} AND NUNOTA = ${Number(nroUnico)} 
            ORDER BY SEQETIQUETA
        `;

        interface VolumeRecord {
            IDREV: string | number;
            SEQETIQUETA: number;
            DHINC: string;
        }

        let volumes: VolumeRecord[] = [];
        const MAX_VOL_RETRIES = 5;
        
        for (let attempt = 1; attempt <= MAX_VOL_RETRIES; attempt++) {
            try {
                console.log(`[ImprimirVolumes] Buscando volumes da separação ${nroSeparacao} (tentativa ${attempt}/${MAX_VOL_RETRIES})...`);
                volumes = await executeQuery<VolumeRecord>(volumesSql, locals.sankhyaServer!, adminSessionId);
                if (volumes && volumes.length > 0) {
                    console.log(`[ImprimirVolumes] Encontrados ${volumes.length} volumes para a separação ${nroSeparacao}.`);
                    break;
                }
            } catch (e) {
                console.error(`[ImprimirVolumes] Erro ao buscar volumes na tentativa ${attempt}:`, e);
            }

            if (attempt < MAX_VOL_RETRIES) {
                await sleep(2000);
            }
        }

        if (!volumes || volumes.length === 0) {
            return json({
                success: false,
                error: [{
                    title: 'Volumes não sincronizados',
                    message: `Os volumes para a separação ${nroSeparacao} ainda não foram gerados no ERP. Por favor, tente novamente em alguns instantes.`
                }],
                data: null
            }, { status: 404 });
        }

        // 5. Generate the HTML document using external templates
        const cards = volumes.map((volume) => {
            let card = cardHtml;
            card = card.replace(/\{\{nroNota\}\}/g, String(separacao.nroNota || ''));
            card = card.replace(/\{\{ordemCarga\}\}/g, String(separacao.ordemCarga || ''));
            card = card.replace(/\{\{dhInc\}\}/g, formatDateTime(volume.DHINC));
            card = card.replace(/\{\{nomeConf\}\}/g, String(separacao.nomeConf || ''));
            card = card.replace(/\{\{codParc\}\}/g, String(separacao.codParc || ''));
            card = card.replace(/\{\{nomeParc\}\}/g, String(separacao.nomeParc || ''));
            card = card.replace(/\{\{cidadeState\}\}/g, `${nomeCid}/${ufSigla}`);
            card = card.replace(/\{\{seqEtiqueta\}\}/g, String(volume.SEQETIQUETA));
            card = card.replace(/\{\{tipoEntrega\}\}/g, (separacao.tipoEntrega || '').substring(0, 5));
            card = card.replace(/\{\{razaoSocial\}\}/g, razaoSocial);
            
            const enderecoCompleto = `${tipoEnd} ${nomeEnd}${numEnd ? `, Nº ${numEnd}` : ''}${complemento ? ` - ${complemento}` : ''} - ${nomeBai} - CEP: ${cep}${telefone ? ` - FONE: ${telefone}` : ''}`;
            card = card.replace(/\{\{enderecoCompleto\}\}/g, enderecoCompleto);
            card = card.replace(/\{\{idRev\}\}/g, String(volume.IDREV));
            
            return card;
        }).join('\n');

        let html = templateHtml;
        html = html.replace(/\{\{nroNota\}\}/g, String(separacao.nroNota || ''));
        html = html.replace(/\{\{content\}\}/g, cards);
        html = html.replace(/\{\{barcodes\}\}/g, JSON.stringify(volumes.map(v => v.IDREV.toString())));

        return new Response(html, {
            headers: {
                'Content-Type': 'text/html; charset=utf-8'
            }
        });

    } catch (error: any) {
        console.error('[ImprimirVolumes] Erro ao gerar etiquetas HTML:', error);
        return json({
            success: false,
            error: [{
                title: 'Erro ao gerar as etiquetas',
                message: error?.message || 'Ocorreu um erro interno ao processar a impressão.'
            }],
            data: null
        }, { status: 500 });
    } finally {
        // Logoff the admin session
        if (adminSessionId) {
            await sankhyaLogout(locals.sankhyaServer!, adminSessionId);
        }
    }
}
