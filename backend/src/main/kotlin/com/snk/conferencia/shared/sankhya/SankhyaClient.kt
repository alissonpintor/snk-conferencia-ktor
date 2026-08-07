package com.snk.conferencia.shared.sankhya

import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.coroutines.CancellationException
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import kotlinx.serialization.json.putJsonObject
import org.slf4j.LoggerFactory
import java.nio.charset.Charset

@Serializable
data class SankhyaRequestEnvelope(
    val serviceName: String,
    val requestBody: JsonObject
)

@Serializable
data class SankhyaGenericResponse(
    val status: String? = null,
    val statusMessage: String? = null,
    val responseBody: JsonObject? = null
)

interface SankhyaClientInterface {
    suspend fun callService(
        baseUrl: String,
        serviceName: String,
        jsessionid: String,
        requestBody: JsonObject
    ): SankhyaGenericResponse

    suspend fun executeQuery(
        baseUrl: String,
        jsessionid: String,
        sql: String
    ): SankhyaGenericResponse

    suspend fun saveRecord(
        baseUrl: String,
        jsessionid: String,
        entityName: String,
        fields: JsonObject
    ): SankhyaGenericResponse
}

class SankhyaClient(
    private val httpClient: HttpClient = createDefaultHttpClient()
) : SankhyaClientInterface {

    private val logger = LoggerFactory.getLogger(SankhyaClient::class.java)
    private val jsonLenient = Json {
        prettyPrint = true
        isLenient = true
        ignoreUnknownKeys = true
    }

    companion object {
        fun createDefaultHttpClient(): HttpClient {
            return HttpClient(CIO) {
                install(ContentNegotiation) {
                    json(Json {
                        prettyPrint = true
                        isLenient = true
                        ignoreUnknownKeys = true
                    })
                }
                install(HttpTimeout) {
                    requestTimeoutMillis = 15_000
                    connectTimeoutMillis = 5_000
                    socketTimeoutMillis = 15_000
                }
            }
        }
    }

    override suspend fun callService(
        baseUrl: String,
        serviceName: String,
        jsessionid: String,
        requestBody: JsonObject
    ): SankhyaGenericResponse {
        val path = if (serviceName.startsWith("MgeWmsSP", ignoreCase = true)) "mgewms" else "mge"
        val endpointUrl = if (jsessionid.isNotBlank()) {
            "$baseUrl/$path/service.sbr?serviceName=$serviceName&mgeSession=$jsessionid&outputType=json"
        } else {
            "$baseUrl/$path/service.sbr?serviceName=$serviceName&outputType=json"
        }

        val envelope = SankhyaRequestEnvelope(
            serviceName = serviceName,
            requestBody = requestBody
        )

        logger.info("Executando serviço Sankhya: {} com URL: {}", serviceName, endpointUrl)

        val httpResponse: HttpResponse = try {
            httpClient.post(endpointUrl) {
                if (jsessionid.isNotBlank()) {
                    header(HttpHeaders.Cookie, "JSESSIONID=$jsessionid")
                }
                contentType(ContentType.Application.Json)
                setBody(envelope)
            }
        } catch (e: Exception) {
            if (e is CancellationException) throw e
            logger.error("Erro de comunicação ao chamar serviço {}: {}", serviceName, e.message)
            throw SankhyaBusinessException("Erro de conexão com o ERP Sankhya.")
        }

        if (httpResponse.status != HttpStatusCode.OK) {
            logger.error("Serviço {} retornou código HTTP não-OK: {}", serviceName, httpResponse.status)
            throw SankhyaBusinessException("Erro de comunicação com ERP Sankhya: HTTP ${httpResponse.status.value}")
        }

        val jsonText = try {
            httpResponse.bodyAsText()
        } catch (e: Exception) {
            if (e is CancellationException) throw e
            try {
                val bytes = httpResponse.readBytes()
                String(bytes, Charset.forName("windows-1252"))
            } catch (_: Exception) {
                throw SankhyaBusinessException("Erro ao ler resposta do servidor Sankhya.")
            }
        }

        val parsedResponse = try {
            jsonLenient.decodeFromString<SankhyaGenericResponse>(jsonText)
        } catch (e: Exception) {
            if (e is CancellationException) throw e
            logger.error("Falha na decodificação JSON do serviço {}. Conteúdo bruto recebido (primeiros 300 chars): '{}'. Erro: {}", 
                serviceName, jsonText.take(300), e.message)

            if (jsonText.contains("<html", ignoreCase = true) || jsonText.contains("login", ignoreCase = true)) {
                throw SankhyaBusinessException("Sessão inválida ou expirada no ERP Sankhya. Por favor, faça login novamente.")
            }
            throw SankhyaBusinessException("Resposta do servidor ERP Sankhya possui formato JSON inválido.")
        }

        if (parsedResponse.status != "1") {
            val msg = parsedResponse.statusMessage ?: "Erro não especificado retornado pelo ERP Sankhya."
            logger.warn("Serviço {} retornou erro de negócio (status={}): {}", serviceName, parsedResponse.status, msg)
            throw SankhyaBusinessException(msg, parsedResponse.status ?: "0")
        }

        return parsedResponse
    }

    override suspend fun executeQuery(
        baseUrl: String,
        jsessionid: String,
        sql: String
    ): SankhyaGenericResponse {
        val body = buildJsonObject {
            put("sql", sql)
        }
        return callService(baseUrl, "DbExplorerSP.executeQuery", jsessionid, body)
    }

    override suspend fun saveRecord(
        baseUrl: String,
        jsessionid: String,
        entityName: String,
        fields: JsonObject
    ): SankhyaGenericResponse {
        val body = buildJsonObject {
            put("entityName", entityName)
            putJsonObject("fields") {
                fields.forEach { (key, value) ->
                    put(key, value)
                }
            }
        }
        return callService(baseUrl, "CRUDServiceProvider.saveRecord", jsessionid, body)
    }
}
