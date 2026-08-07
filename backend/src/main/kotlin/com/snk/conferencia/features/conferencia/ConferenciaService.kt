package com.snk.conferencia.features.conferencia

import com.snk.conferencia.shared.sankhya.SankhyaClientInterface
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import kotlinx.serialization.json.putJsonObject
import java.util.Base64

interface ConferenciaServiceInterface {
    suspend fun enviarParaDoca(baseUrl: String, jsessionid: String, userId: String, request: EnviarDocaRequest): ConferenciaActionResponse
    suspend fun cancelarConferencia(baseUrl: String, jsessionid: String, userId: String, request: CancelarConferenciaRequest): ConferenciaActionResponse
    suspend fun imprimirVolumes(baseUrl: String, jsessionid: String, request: ImprimirVolumesRequest): ConferenciaActionResponse
}

class ConferenciaService(
    private val sankhyaClient: SankhyaClientInterface
) : ConferenciaServiceInterface {

    override suspend fun enviarParaDoca(
        baseUrl: String,
        jsessionid: String,
        userId: String,
        request: EnviarDocaRequest
    ): ConferenciaActionResponse {
        if (request.nroConferencia <= 0 || request.nroNota <= 0) {
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
                putJsonObject("NUMNOTA") { put("$", request.nroNota.toString()) }
                request.ordemCarga?.let { putJsonObject("ORDEMCARGA") { put("$", it.toString()) } }
            }
        }

        val response = sankhyaClient.callService(
            baseUrl = baseUrl,
            serviceName = "MgeWmsSP.enviaConferenciaPedidosParaDoca",
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
            serviceName = "MgeWmsSP.cancelaConferencia",
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
    ): ConferenciaActionResponse {
        if (request.nroUnico <= 0 || request.nroSeparacao <= 0) {
            throw IllegalArgumentException("Número único e número de separação devem ser maiores que zero.")
        }

        val sql = "SELECT IDREV, SEQETIQUETA FROM TGWREV WHERE NUSEPARACAO = ${request.nroSeparacao} AND NUNOTA = ${request.nroUnico} ORDER BY SEQETIQUETA"
        val response = sankhyaClient.executeQuery(baseUrl, jsessionid, sql)

        return ConferenciaActionResponse(
            status = response.status ?: "1",
            mensagem = "Solicitação de impressão realizada com sucesso."
        )
    }

    private fun encodeUserId(userId: String): String {
        val idStr = if (userId.isBlank()) "0" else userId.trim()
        return try {
            Base64.getEncoder().encodeToString(idStr.toByteArray(Charsets.UTF_8))
        } catch (e: Exception) {
            idStr
        }
    }
}
