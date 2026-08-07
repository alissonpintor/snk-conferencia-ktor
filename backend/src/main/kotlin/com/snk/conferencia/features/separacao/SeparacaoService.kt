package com.snk.conferencia.features.separacao

import com.snk.conferencia.shared.sankhya.SankhyaClientInterface
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.contentOrNull
import kotlinx.serialization.json.jsonPrimitive
import kotlinx.serialization.json.put
import kotlinx.serialization.json.putJsonObject

interface SeparacaoServiceInterface {
    suspend fun buscarSeparacoes(baseUrl: String, jsessionid: String, filtros: SeparacaoFilterRequest): List<SeparacaoResponse>
    suspend fun buscarItens(baseUrl: String, jsessionid: String, nroSeparacao: Long): List<ItemSeparacaoResponse>
    suspend fun obterQuantidadeVolumes(baseUrl: String, jsessionid: String, nroSeparacao: Long): QuantidadeVolumesResponse
    suspend fun gerarVolumes(baseUrl: String, jsessionid: String, nroSeparacao: Long, request: GerarVolumesRequest): GerarVolumesResponse
}

class SeparacaoService(
    private val sankhyaClient: SankhyaClientInterface
) : SeparacaoServiceInterface {

    override suspend fun buscarSeparacoes(
        baseUrl: String,
        jsessionid: String,
        filtros: SeparacaoFilterRequest
    ): List<SeparacaoResponse> {
        val conditions = mutableListOf<String>()

        filtros.empresa?.let { conditions.add("CODEMPOC = $it") }
        filtros.parceiro?.let { conditions.add("CODPARC = $it") }
        filtros.nroSeparacao?.let { conditions.add("NUSEPARACAO = $it") }
        filtros.nroConferencia?.let { conditions.add("NUCONFERENCIA = $it") }
        filtros.nroUnico?.let { conditions.add("NUNOTA = $it") }
        filtros.nroPedido?.let { conditions.add("NUMNOTA = $it") }
        filtros.ordemCarga?.let { conditions.add("ORDEMCARGA = $it") }
        filtros.produto?.let { conditions.add("EXISTS (SELECT 1 FROM TGWITT I WHERE I.CODPROD = $it AND I.NUTAREFA = NROTAREFA)") }

        filtros.situacao?.takeIf { it.isNotEmpty() }?.let { sitList ->
            val sitStr = sitList.joinToString(",")
            conditions.add("COD_SITUACAO IN ($sitStr)")
        }

        filtros.dataInicio?.takeIf { it.isNotBlank() }?.let { dtIni ->
            val formatted = sanitizeDate(dtIni)
            conditions.add("DTSEPARACAO >= TO_DATE('$formatted', 'YYYY-MM-DD')")
        }

        filtros.dataFim?.takeIf { it.isNotBlank() }?.let { dtFim ->
            val formatted = sanitizeDate(dtFim)
            conditions.add("DTSEPARACAO <= TO_DATE('$formatted', 'YYYY-MM-DD')")
        }

        if (conditions.isEmpty()) {
            throw IllegalArgumentException("Informe pelo menos um filtro para buscar as separações.")
        }

        val whereClause = conditions.joinToString(" AND ")
        val sql = "SELECT CODEMPOC, NUSEPARACAO, NROTAREFA, NUNOTA, NUMNOTA, CODPARC, NOMEPARC, ORDEMCARGA, TO_CHAR(DTSEPARACAO, 'YYYY-MM-DD') AS DTSEPARACAO, COD_SITUACAO, SITUACAO, NUCONFERENCIA, ENVIADO_DOCA, CODUSU, NOMEUSU, SEPARADOR, CODAREASEP, NOMEAREASEP, ENDERECO, TIPO_ENTREGA FROM APP_SEPARACAO WHERE $whereClause ORDER BY NUSEPARACAO DESC"

        val response = sankhyaClient.executeQuery(baseUrl, jsessionid, sql)
        val rows = parseDbExplorerRows(response.responseBody)

        return rows.map { row ->
            val enviadoDocaRaw = row["ENVIADO_DOCA"]
            val enviadoDocaFormatted = if (enviadoDocaRaw == "S") "Sim" else "Não"

            SeparacaoResponse(
                codEmp = row["CODEMPOC"]?.toLongOrNull() ?: 0L,
                nroSeparacao = row["NUSEPARACAO"]?.toLongOrNull() ?: 0L,
                nroTarefa = row["NROTAREFA"]?.toLongOrNull(),
                nroUnico = row["NUNOTA"]?.toLongOrNull() ?: 0L,
                nroNota = row["NUMNOTA"]?.toLongOrNull() ?: 0L,
                codParc = row["CODPARC"]?.toLongOrNull() ?: 0L,
                nomeParc = row["NOMEPARC"] ?: "",
                ordemCarga = row["ORDEMCARGA"]?.toLongOrNull(),
                dataSeparacao = row["DTSEPARACAO"],
                codSit = row["COD_SITUACAO"]?.toIntOrNull(),
                situacao = row["SITUACAO"],
                nroConferencia = row["NUCONFERENCIA"]?.toLongOrNull(),
                enviadoParaDoca = enviadoDocaFormatted,
                codConf = row["CODUSU"]?.toLongOrNull(),
                nomeConf = row["NOMEUSU"],
                separador = row["SEPARADOR"],
                codArea = row["CODAREASEP"]?.toLongOrNull(),
                areaSeparacao = row["NOMEAREASEP"],
                checkout = row["ENDERECO"],
                tipoEntrega = row["TIPO_ENTREGA"]
            )
        }
    }

    override suspend fun buscarItens(
        baseUrl: String,
        jsessionid: String,
        nroSeparacao: Long
    ): List<ItemSeparacaoResponse> {
        val sql = "SELECT NUSEPARACAO, NUTAREFA, CODPROD, DESCRICAO, MARCA, REFERENCIA, REFFORN, UND, QTD, ENDORIG, ENDDEST, NOMEUSU, SITUACAO, TO_CHAR(DHINICIALEXEC, 'YYYY-MM-DD\"T\"HH24:MI:SS') AS DHINICIALEXEC, TO_CHAR(DHFINALEXEC, 'YYYY-MM-DD\"T\"HH24:MI:SS') AS DHFINALEXEC FROM APP_ITENS_SEPARACAO WHERE NUSEPARACAO = $nroSeparacao ORDER BY DESCRICAO"

        val response = sankhyaClient.executeQuery(baseUrl, jsessionid, sql)
        val rows = parseDbExplorerRows(response.responseBody)

        return rows.map { row ->
            ItemSeparacaoResponse(
                nroSeparacao = row["NUSEPARACAO"]?.toLongOrNull() ?: nroSeparacao,
                nroTarefa = row["NUTAREFA"]?.toLongOrNull(),
                codProduto = row["CODPROD"]?.toLongOrNull() ?: 0L,
                descricaoProduto = row["DESCRICAO"] ?: "",
                marca = row["MARCA"],
                codBarras = row["REFERENCIA"],
                referencia = row["REFFORN"],
                unidade = row["UND"],
                quantidade = row["QTD"]?.toDoubleOrNull() ?: 0.0,
                endOrigem = row["ENDORIG"],
                endDestino = row["ENDDEST"],
                usuario = row["NOMEUSU"],
                situacao = row["SITUACAO"],
                dtHrInicial = row["DHINICIALEXEC"],
                dtHrFinal = row["DHFINALEXEC"]
            )
        }
    }

    override suspend fun obterQuantidadeVolumes(
        baseUrl: String,
        jsessionid: String,
        nroSeparacao: Long
    ): QuantidadeVolumesResponse {
        val sql = "SELECT COUNT(1) AS QTD FROM TGWREV WHERE NUSEPARACAO = $nroSeparacao"
        val response = sankhyaClient.executeQuery(baseUrl, jsessionid, sql)
        val rows = parseDbExplorerRows(response.responseBody)

        val qtd = rows.firstOrNull()?.get("QTD")?.toIntOrNull() ?: 0
        return QuantidadeVolumesResponse(
            nroSeparacao = nroSeparacao,
            quantidade = qtd
        )
    }

    override suspend fun gerarVolumes(
        baseUrl: String,
        jsessionid: String,
        nroSeparacao: Long,
        request: GerarVolumesRequest
    ): GerarVolumesResponse {
        if (request.quantidade <= 0) {
            throw IllegalArgumentException("A quantidade de volumes deve ser maior que zero.")
        }

        val requestBody = buildJsonObject {
            putJsonObject("ETIQUETAS") {
                putJsonObject("NUCONFERENCIA") { put("$", request.nroConferencia) }
                putJsonObject("QTDEVOLUMES") { put("$", request.quantidade) }
                putJsonObject("QTDEXISTENTE") { put("$", request.quantidadeAtual) }
            }
        }

        val response = sankhyaClient.callService(
            baseUrl = baseUrl,
            serviceName = "MgeWmsSP.gerarEtiquetasVolume",
            jsessionid = jsessionid,
            requestBody = requestBody
        )

        return GerarVolumesResponse(
            nroSeparacao = nroSeparacao,
            status = response.status ?: "1",
            mensagem = "Volumes gerados com sucesso."
        )
    }

    private fun sanitizeDate(input: String): String {
        val cleaned = input.substringBefore("T").trim()
        val dateRegex = Regex("^\\d{4}-\\d{2}-\\d{2}$")
        if (!dateRegex.matches(cleaned)) {
            throw IllegalArgumentException("Data inválida. Use o formato YYYY-MM-DD.")
        }
        return cleaned
    }

    private fun parseDbExplorerRows(responseBody: JsonObject?): List<Map<String, String>> {
        if (responseBody == null) return emptyList()

        val fieldsMetadata = responseBody["fieldsMetadata"] as? JsonArray ?: return emptyList()
        val rows = responseBody["rows"] as? JsonArray ?: return emptyList()

        val fieldNames = fieldsMetadata.mapNotNull {
            (it as? JsonObject)?.get("name")?.jsonPrimitive?.contentOrNull
        }

        return rows.mapNotNull { row ->
            val rowArray = row as? JsonArray ?: return@mapNotNull null
            val map = mutableMapOf<String, String>()
            fieldNames.forEachIndexed { index, name ->
                val value = rowArray.getOrNull(index)?.jsonPrimitive?.contentOrNull ?: ""
                map[name] = value
            }
            map
        }
    }
}
