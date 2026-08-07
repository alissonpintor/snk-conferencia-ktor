package com.snk.conferencia.features.conferencia

import com.snk.conferencia.shared.sankhya.SankhyaBusinessException
import com.snk.conferencia.shared.sankhya.SankhyaClientInterface
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.contentOrNull
import kotlinx.serialization.json.jsonPrimitive
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import kotlinx.serialization.json.putJsonObject
import java.util.Base64

interface ConferenciaServiceInterface {
    suspend fun buscarConferencia(baseUrl: String, jsessionid: String, request: BuscarConferenciaRequest): List<ConferenciaResponse>
    suspend fun iniciarConferencia(baseUrl: String, jsessionid: String, userId: String, request: IniciarConferenciaRequest): List<IniciarConferenciaResponse>
    suspend fun buscarTarefasPendentes(baseUrl: String, jsessionid: String, userId: String): List<ConferenciaPendenteResponse>
    suspend fun buscarItensConferencia(baseUrl: String, jsessionid: String, nroConferencia: Long, codProduto: Long? = null, codBarra: String? = null): List<ItemConferenciaResponse>
    suspend fun obterInfoProduto(baseUrl: String, jsessionid: String, userId: String, request: InfoProdutoRequest): InfoProdutoResponse
    suspend fun registrarItemConferido(baseUrl: String, jsessionid: String, userId: String, request: RegistrarItemConferidoRequest): RegistrarItemResponse
    suspend fun atualizarSaldoItem(baseUrl: String, jsessionid: String, request: AtualizarSaldoRequest): List<SaldoItemResponse>
    suspend fun removerItens(baseUrl: String, jsessionid: String, userId: String, request: RemoverItensRequest): ConferenciaActionResponse
    suspend fun finalizarConferencia(baseUrl: String, jsessionid: String, userId: String, request: FinalizarConferenciaRequest): FinalizarConferenciaResponse
    suspend fun registrarVolumes(baseUrl: String, jsessionid: String, userId: String, request: RegistrarVolumesRequest): ConferenciaActionResponse
    suspend fun enviarParaDoca(baseUrl: String, jsessionid: String, userId: String, request: EnviarDocaRequest): ConferenciaActionResponse
    suspend fun cancelarConferencia(baseUrl: String, jsessionid: String, userId: String, request: CancelarConferenciaRequest): ConferenciaActionResponse
    suspend fun imprimirVolumes(baseUrl: String, jsessionid: String, request: ImprimirVolumesRequest): String
}

class ConferenciaService(
    private val sankhyaClient: SankhyaClientInterface
) : ConferenciaServiceInterface {

    override suspend fun buscarConferencia(
        baseUrl: String,
        jsessionid: String,
        request: BuscarConferenciaRequest
    ): List<ConferenciaResponse> {
        val conditions = mutableListOf<String>()

        request.checkout?.takeIf { it.isNotBlank() }?.let {
            val formatted = formatCheckout(it)
            conditions.add("'$formatted' IN ENDERECO")
            conditions.add("COD_SITUACAO = 3")
        }

        request.nroConferencia?.let {
            conditions.add("NUCONFERENCIA = $it")
        }

        if (conditions.isEmpty()) {
            throw IllegalArgumentException("Informe o checkout ou o número da conferência.")
        }

        val whereClause = conditions.joinToString(" AND ")
        val sql = "SELECT NUCONFERENCIA, NUSEPARACAO, NUNOTA, NUMNOTA, ORDEMCARGA, ENDERECO, CODENDDOCA, DESCRENDDOCA FROM APP_SEPARACAO WHERE $whereClause ORDER BY NUSEPARACAO DESC"

        val response = sankhyaClient.executeQuery(baseUrl, jsessionid, sql)
        val rows = parseDbExplorerRows(response.responseBody)

        return rows.map { row ->
            ConferenciaResponse(
                nroConferencia = row["NUCONFERENCIA"]?.toLongOrNull(),
                nroSeparacao = row["NUSEPARACAO"]?.toLongOrNull() ?: 0L,
                nroUnico = row["NUNOTA"]?.toLongOrNull() ?: 0L,
                nroNota = row["NUMNOTA"]?.toLongOrNull() ?: 0L,
                ordemCarga = row["ORDEMCARGA"]?.toLongOrNull(),
                checkout = row["ENDERECO"],
                codDoca = row["CODENDDOCA"]?.toLongOrNull(),
                descrDoca = row["DESCRENDDOCA"]
            )
        }
    }

    override suspend fun iniciarConferencia(
        baseUrl: String,
        jsessionid: String,
        userId: String,
        request: IniciarConferenciaRequest
    ): List<IniciarConferenciaResponse> {
        if (request.checkout.isBlank()) {
            throw IllegalArgumentException("O checkout é obrigatório para iniciar a conferência.")
        }

        val formattedCheckout = formatCheckout(request.checkout)
        val encodedUserId = encodeUserId(userId)

        val requestBody = buildJsonObject {
            putJsonObject("idusu") { put("$", encodedUserId) }
            putJsonObject("ENDERECO") { put("$", formattedCheckout) }
        }

        val response = sankhyaClient.callService(
            baseUrl = baseUrl,
            serviceName = "MgeWmsSP.buscaConferenciaPorPedido",
            jsessionid = jsessionid,
            requestBody = requestBody
        )

        val linhas = parseLinhas(response.responseBody)
        return linhas.map { row ->
            IniciarConferenciaResponse(
                nroConferencia = row["NUCONFERENCIA"]?.jsonPrimitive?.contentOrNull?.toLongOrNull() ?: 0L,
                tipoConferencia = row["TIPCONF"]?.jsonPrimitive?.contentOrNull ?: "E",
                sepAgrupada = row["SEPARACAO_AGRUPADA"]?.jsonPrimitive?.contentOrNull,
                volumeContinuo = row["VOLCONTINUO"]?.jsonPrimitive?.contentOrNull,
                impEtiquetaFechVol = row["IMPETIQFECHVOL"]?.jsonPrimitive?.contentOrNull
            )
        }
    }

    override suspend fun buscarTarefasPendentes(
        baseUrl: String,
        jsessionid: String,
        userId: String
    ): List<ConferenciaPendenteResponse> {
        val userLong = userId.toLongOrNull()
            ?: throw IllegalArgumentException("ID do usuário é obrigatório.")

        val sql = "SELECT NUCONFERENCIA, ENDERECO, NUSEPARACAO FROM APP_SEPARACAO WHERE COD_SITUACAO = 4 AND CODUSU = $userLong ORDER BY NUSEPARACAO DESC"

        val response = sankhyaClient.executeQuery(baseUrl, jsessionid, sql)
        val rows = parseDbExplorerRows(response.responseBody)

        return rows.map { row ->
            ConferenciaPendenteResponse(
                nroConferencia = row["NUCONFERENCIA"]?.toLongOrNull() ?: 0L,
                checkout = row["ENDERECO"],
                nroSeparacao = row["NUSEPARACAO"]?.toLongOrNull() ?: 0L
            )
        }
    }

    override suspend fun buscarItensConferencia(
        baseUrl: String,
        jsessionid: String,
        nroConferencia: Long,
        codProduto: Long?,
        codBarra: String?
    ): List<ItemConferenciaResponse> {
        if (nroConferencia <= 0) {
            throw IllegalArgumentException("Número de conferência inválido.")
        }

        val conditions = mutableListOf("NUCONFERENCIA = $nroConferencia")
        codProduto?.let { conditions.add("CODPROD = $it") }
        codBarra?.takeIf { it.isNotBlank() }?.let { conditions.add("CODPROD = GET_CODPROD_WITH_CODBARR('$it')") }

        val whereClause = conditions.joinToString(" AND ")
        val sql = "SELECT CODPROD, DESCRPROD, CODBARRA, QTDNEG, QTDCONFERIDA, QTDAVARIA FROM APP_CONFERENCIA_ITENS WHERE $whereClause ORDER BY DESCRPROD"

        val response = sankhyaClient.executeQuery(baseUrl, jsessionid, sql)
        val rows = parseDbExplorerRows(response.responseBody)

        return rows.map { row ->
            ItemConferenciaResponse(
                codProduto = row["CODPROD"]?.toLongOrNull() ?: 0L,
                descrProduto = row["DESCRPROD"] ?: "",
                codBarra = row["CODBARRA"],
                quantidade = row["QTDNEG"]?.toDoubleOrNull() ?: 0.0,
                qtdadeConferida = row["QTDCONFERIDA"]?.toDoubleOrNull() ?: 0.0,
                qtdadeAvariada = row["QTDAVARIA"]?.toDoubleOrNull() ?: 0.0,
                sequencias = emptyList(),
                possuiDivergencia = false
            )
        }
    }

    override suspend fun obterInfoProduto(
        baseUrl: String,
        jsessionid: String,
        userId: String,
        request: InfoProdutoRequest
    ): InfoProdutoResponse {
        if (request.nroConferencia <= 0 || request.codBarra.isBlank()) {
            throw IllegalArgumentException("Número de conferência e código de barras são obrigatórios.")
        }

        val encodedUserId = encodeUserId(userId)
        val requestBody = buildJsonObject {
            putJsonObject("idusu") { put("$", encodedUserId) }
            putJsonObject("NUCONFERENCIA") { put("$", request.nroConferencia.toString()) }
            putJsonObject("VALIDARQTD") { put("$", "S") }
            putJsonObject("CODBARRAS") { put("$", request.codBarra) }
            putJsonObject("QUANTIDADE") { put("$", request.quantidade.toString()) }
        }

        val response = sankhyaClient.callService(
            baseUrl = baseUrl,
            serviceName = "MgeWmsSP.buscaInfoProduto",
            jsessionid = jsessionid,
            requestBody = requestBody
        )

        val row = parseLinhas(response.responseBody).firstOrNull()
            ?: throw IllegalArgumentException("Produto não encontrado para o código de barras informado.")

        return InfoProdutoResponse(
            codProduto = row["CODPROD"]?.jsonPrimitive?.contentOrNull?.toLongOrNull() ?: 0L,
            descrProduto = row["DESCRPROD"]?.jsonPrimitive?.contentOrNull ?: "",
            complemento = row["COMPLEMENTO"]?.jsonPrimitive?.contentOrNull,
            pesoBruto = row["PESOBRUTO"]?.jsonPrimitive?.contentOrNull?.toDoubleOrNull()
        )
    }

    override suspend fun registrarItemConferido(
        baseUrl: String,
        jsessionid: String,
        userId: String,
        request: RegistrarItemConferidoRequest
    ): RegistrarItemResponse {
        if (request.nroConferencia <= 0 || request.codBarra.isBlank()) {
            throw IllegalArgumentException("Número de conferência e código de barras são obrigatórios.")
        }
        if (request.quantidade <= 0) {
            throw IllegalArgumentException("Quantidade deve ser maior que zero.")
        }

        val encodedUserId = encodeUserId(userId)
        val requestBody = buildJsonObject {
            putJsonObject("idusu") { put("$", encodedUserId) }
            putJsonObject("CONFERENCIA") {
                putJsonObject("NUCONFERENCIA") { put("$", request.nroConferencia.toString()) }
                putJsonObject("CODBARRA") { put("$", request.codBarra) }
                putJsonObject("CONTROLE") { put("$", "") }
                putJsonObject("SERIES") { put("$", "") }
                putJsonObject("DTVALIDADE") { put("$", "") }
                putJsonObject("QUANTIDADE") { put("$", request.quantidade.toString()) }
                putJsonObject("QTDAVARIA") { put("$", request.qtdadeAvariada.toString()) }
                request.nroVolume?.let { putJsonObject("NUMVOL") { put("$", it.toString()) } }
                request.codCaixa?.let { putJsonObject("CODCAIXA") { put("$", it) } }
                putJsonObject("MODOEDICAO") { put("$", request.modoEdicao) }
                putJsonObject("VOLCONTINUO") { put("$", request.volumeContinuo) }
            }
        }

        val response = sankhyaClient.callService(
            baseUrl = baseUrl,
            serviceName = "MgeWmsSP.insereItemConferidoColetor",
            jsessionid = jsessionid,
            requestBody = requestBody
        )

        return RegistrarItemResponse(
            status = response.status ?: "OK",
            mensagem = response.statusMessage ?: "Item conferido registrado com sucesso."
        )
    }

    override suspend fun atualizarSaldoItem(
        baseUrl: String,
        jsessionid: String,
        request: AtualizarSaldoRequest
    ): List<SaldoItemResponse> {
        if (request.nroConferencia <= 0) {
            throw IllegalArgumentException("Número de conferência é obrigatório para atualizar o saldo.")
        }

        val conditions = mutableListOf("NUCONFERENCIA = ${request.nroConferencia}")
        request.codProduto?.let { conditions.add("CODPROD = $it") }
        request.codBarra?.takeIf { it.isNotBlank() }?.let { conditions.add("CODPROD = GET_CODPROD_WITH_CODBARR('$it')") }

        val whereClause = conditions.joinToString(" AND ")
        val sql = "SELECT NUCONFERENCIA, CODPROD, QTCONFERIDA, QTDAVARIA, SEQQUENCIA FROM APP_CONFERENCIA_ITENS_SALDO WHERE $whereClause"

        val response = sankhyaClient.executeQuery(baseUrl, jsessionid, sql)
        val rows = parseDbExplorerRows(response.responseBody)

        return rows.map { row ->
            val seqRaw = row["SEQQUENCIA"]
            val sequencias = if (seqRaw.isNullOrBlank()) emptyList() else seqRaw.split(",").mapNotNull { it.trim().toLongOrNull() }

            SaldoItemResponse(
                codProduto = row["CODPROD"]?.toLongOrNull() ?: 0L,
                qtdadeConferida = row["QTCONFERIDA"]?.toDoubleOrNull() ?: 0.0,
                sequencias = sequencias,
                qtdadeAvariada = row["QTDAVARIA"]?.toDoubleOrNull() ?: 0.0,
                possuiDivergencia = false
            )
        }
    }

    override suspend fun removerItens(
        baseUrl: String,
        jsessionid: String,
        userId: String,
        request: RemoverItensRequest
    ): ConferenciaActionResponse {
        if (request.nroConferencia <= 0) {
            throw IllegalArgumentException("Número de conferência é obrigatório.")
        }

        val encodedUserId = encodeUserId(userId)
        val seqStr = request.sequencias?.joinToString(",") ?: ""

        val requestBody = buildJsonObject {
            putJsonObject("idusu") { put("$", encodedUserId) }
            putJsonObject("CONFERENCIA") {
                putJsonObject("idusu") { put("$", encodedUserId) }
                putJsonObject("NUCONFERENCIA") { put("$", request.nroConferencia.toString()) }
                putJsonObject("SEQUENCIAS") { put("$", seqStr) }
                putJsonObject("REMOVERSERIES") { put("$", "N") }
            }
        }

        val response = sankhyaClient.callService(
            baseUrl = baseUrl,
            serviceName = "MgeWmsSP.removeItensConferidosColetor",
            jsessionid = jsessionid,
            requestBody = requestBody
        )

        return ConferenciaActionResponse(
            status = response.status ?: "1",
            mensagem = response.statusMessage ?: "Itens da conferência removidos com sucesso."
        )
    }

    override suspend fun finalizarConferencia(
        baseUrl: String,
        jsessionid: String,
        userId: String,
        request: FinalizarConferenciaRequest
    ): FinalizarConferenciaResponse {
        if (request.nroConferencia <= 0) {
            throw IllegalArgumentException("Número de conferência é obrigatório.")
        }

        val encodedUserId = encodeUserId(userId)
        val requestBody = buildJsonObject {
            putJsonObject("idusu") { put("$", encodedUserId) }
            putJsonObject("tipoConferencia") { put("$", "SAIDA") }
            putJsonObject("nuConferencia") { put("$", request.nroConferencia.toString()) }
            putJsonObject("contarVazio") { put("$", "N") }
            putJsonObject("finalizarConferenciaParcial") { put("$", "N") }
            putJsonObject("forcarParcialComoDivergente") { put("$", "N") }
            putJsonObject("UTILIZAEXPLOTE") { put("$", "N") }
            putJsonObject("MULTICONFERENTES") { put("$", "N") }
            putJsonObject("PREFERENCIANOTIFDIVFINAL") { put("$", "S") }
            putJsonObject("CONFERENCIA_PEDIDO") { put("$", "S") }
        }

        val response = sankhyaClient.callService(
            baseUrl = baseUrl,
            serviceName = "MgeWmsSP.produtosConferidos",
            jsessionid = jsessionid,
            requestBody = requestBody
        )

        val linhas = parseLinhas(response.responseBody)
        val temDivergencia = linhas.firstOrNull()?.get("DIVERGENCIA")?.jsonPrimitive?.contentOrNull == "true"
        if (temDivergencia) {
            throw SankhyaBusinessException(
                response.statusMessage ?: "Houve divergência no processo de conferência."
            )
        }

        return FinalizarConferenciaResponse(
            nroConferencia = request.nroConferencia,
            status = response.status ?: "1",
            mensagem = response.statusMessage ?: "Conferência finalizada com sucesso."
        )
    }

    override suspend fun registrarVolumes(
        baseUrl: String,
        jsessionid: String,
        userId: String,
        request: RegistrarVolumesRequest
    ): ConferenciaActionResponse {
        if (request.nroConferencia <= 0 || request.quantidade <= 0) {
            throw IllegalArgumentException("Número de conferência e quantidade de volumes devem ser maiores que zero.")
        }

        val encodedUserId = encodeUserId(userId)
        val requestBody = buildJsonObject {
            putJsonObject("idusu") { put("$", encodedUserId) }
            putJsonObject("ETIQUETAS") {
                putJsonObject("NUCONFERENCIA") { put("$", request.nroConferencia.toString()) }
                putJsonObject("QTDEVOLUMES") { put("$", request.quantidade.toString()) }
                putJsonObject("IGNORARGERADAS") { put("$", "S") }
                putJsonObject("SANKHYAW") { put("$", "N") }
            }
        }

        val response = sankhyaClient.callService(
            baseUrl = baseUrl,
            serviceName = "MgeWmsSP.registraEtiquetasVolume",
            jsessionid = jsessionid,
            requestBody = requestBody
        )

        return ConferenciaActionResponse(
            status = response.status ?: "1",
            mensagem = response.statusMessage ?: "Volumes registrados com sucesso."
        )
    }

    override suspend fun enviarParaDoca(
        baseUrl: String,
        jsessionid: String,
        userId: String,
        request: EnviarDocaRequest
    ): ConferenciaActionResponse {
        val nroNota = request.nroNota ?: 0L
        if (request.nroConferencia <= 0 || nroNota <= 0) {
            throw IllegalArgumentException("Número de conferência e número de nota devem ser maiores que zero.")
        }
        request.ordemCarga?.let {
            if (it <= 0) throw IllegalArgumentException("Ordem de carga deve ser maior que zero.")
        }

        val encodedUserId = encodeUserId(userId)

        val requestBody = buildJsonObject {
            putJsonObject("idusu") {
                put("$", encodedUserId)
            }
            putJsonObject("conferencia") {
                putJsonObject("NUCONFERENCIA") { put("$", request.nroConferencia.toString()) }
                putJsonObject("NUMNOTA") { put("$", nroNota.toString()) }
                request.ordemCarga?.let { putJsonObject("ORDEMCARGA") { put("$", it.toString()) } }
            }
        }

        val response = sankhyaClient.callService(
            baseUrl = baseUrl,
            serviceName = "MgeWmsSP.liberaCheckoutDoca",
            jsessionid = jsessionid,
            requestBody = requestBody
        )

        return ConferenciaActionResponse(
            status = response.status ?: "1",
            mensagem = "Conferência enviada para a doca com sucesso."
        )
    }

    override suspend fun cancelarConferencia(
        baseUrl: String,
        jsessionid: String,
        userId: String,
        request: CancelarConferenciaRequest
    ): ConferenciaActionResponse {
        if (request.nroConferencia <= 0) {
            throw IllegalArgumentException("Número de conferência deve ser maior que zero.")
        }

        val encodedUserId = encodeUserId(userId)

        val requestBody = buildJsonObject {
            putJsonObject("idusu") {
                put("$", encodedUserId)
            }
            putJsonObject("NUCONFERENCIA") {
                put("$", request.nroConferencia.toString())
            }
            putJsonObject("MULTICONFERENTES") {
                put("$", "N")
            }
            request.codSit?.let {
                putJsonObject("CODSIT") { put("$", it.toString()) }
            }
        }

        val response = sankhyaClient.callService(
            baseUrl = baseUrl,
            serviceName = "MgeWmsSP.cancelaTarefa",
            jsessionid = jsessionid,
            requestBody = requestBody
        )

        return ConferenciaActionResponse(
            status = response.status ?: "1",
            mensagem = "Conferência cancelada com sucesso."
        )
    }

    override suspend fun imprimirVolumes(
        baseUrl: String,
        jsessionid: String,
        request: ImprimirVolumesRequest
    ): String {
        val nroUnico = request.nroUnico ?: 0L
        val nroSeparacao = request.nroSeparacao ?: 0L
        if (nroUnico <= 0 || nroSeparacao <= 0) {
            throw IllegalArgumentException("Número único e número de separação devem ser maiores que zero.")
        }

        val sql = "SELECT IDREV, SEQETIQUETA, DHINC FROM TGWREV WHERE NUSEPARACAO = $nroSeparacao AND NUNOTA = $nroUnico ORDER BY SEQETIQUETA"
        val response = sankhyaClient.executeQuery(baseUrl, jsessionid, sql)
        val rows = parseDbExplorerRows(response.responseBody)

        if (rows.isEmpty()) {
            throw SankhyaBusinessException("Nenhum volume encontrado para impressão da separação $nroSeparacao.")
        }

        val labelsHtml = rows.joinToString("\n") { row ->
            val idRev = row["IDREV"] ?: ""
            val seqEtiqueta = row["SEQETIQUETA"] ?: "1"
            val dhInc = row["DHINC"] ?: ""
            """<div class="label-card"><div class="idrev">$idRev</div><div class="seq">$seqEtiqueta</div><div class="dh">$dhInc</div></div>"""
        }

        return """<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Etiquetas Volume $nroSeparacao</title></head><body><div class="labels-container">$labelsHtml</div></body></html>"""
    }

    private fun formatCheckout(checkout: String): String {
        val trimmed = checkout.trim()
        if (trimmed.length == 8 && trimmed.all { it.isDigit() }) {
            return "${trimmed.substring(0, 2)}.${trimmed.substring(2, 5)}.${trimmed.substring(5, 8)}"
        }
        return trimmed
    }

    private fun encodeUserId(userId: String): String {
        val idStr = if (userId.isBlank()) "0" else userId.trim()
        return try {
            Base64.getEncoder().encodeToString(idStr.toByteArray(Charsets.UTF_8))
        } catch (e: Exception) {
            idStr
        }
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

    private fun parseLinhas(responseBody: JsonObject?): List<JsonObject> {
        if (responseBody == null) return emptyList()
        val entity = responseBody["entity"] as? JsonObject ?: return emptyList()
        val linhas = entity["linhas"] as? JsonObject ?: return emptyList()
        val linha = linhas["linha"] ?: return emptyList()
        return when (linha) {
            is JsonArray -> linha.mapNotNull { it as? JsonObject }
            is JsonObject -> listOf(linha)
            else -> emptyList()
        }
    }
}
