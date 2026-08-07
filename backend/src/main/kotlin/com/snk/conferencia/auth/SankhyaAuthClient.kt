package com.snk.conferencia.auth

import com.snk.conferencia.plugins.AuthenticationException
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.json.Json
import org.slf4j.LoggerFactory
import java.nio.charset.Charset
import java.util.Base64

interface SankhyaAuthClientInterface {
    suspend fun login(credentials: AuthCredentialsDto): SankhyaLoginResponseDto
    suspend fun logout(jsessionid: String, server: String): Boolean
}

class SankhyaAuthClient(
    private val prodUrl: String = "https://sankhya.stoky.com.br",
    private val treinaUrl: String = "https://teste.stoky.com.br",
    private val httpClient: HttpClient = createDefaultHttpClient()
) : SankhyaAuthClientInterface {

    private val logger = LoggerFactory.getLogger(SankhyaAuthClient::class.java)

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
                    requestTimeoutMillis = 10_000
                    connectTimeoutMillis = 5_000
                    socketTimeoutMillis = 10_000
                }
            }
        }
    }

    override suspend fun login(credentials: AuthCredentialsDto): SankhyaLoginResponseDto {
        val baseUrl = if (credentials.server.equals("producao", ignoreCase = true)) {
            prodUrl
        } else {
            treinaUrl
        }

        val endpointUrl = "$baseUrl/mge/service.sbr?serviceName=MobileLoginSP.login&outputType=json"

        val requestBody = SankhyaLoginRequestBody(
            serviceName = "MobileLoginSP.login",
            requestBody = SankhyaLoginParams(
                NOMUSU = mapOf("$" to credentials.username),
                INTERNO = mapOf("$" to credentials.password),
                KEEPCONNECTED = mapOf("$" to "S")
            )
        )

        logger.info("Enviando requisição de autenticação para Sankhya no servidor: {}", credentials.server)

        val httpResponse: HttpResponse = try {
            httpClient.post(endpointUrl) {
                contentType(ContentType.Application.Json)
                setBody(requestBody)
            }
        } catch (e: Exception) {
            logger.error("Erro de comunicação com o servidor Sankhya: {}", e.message)
            throw AuthenticationException("Erro de conexão com o servidor Sankhya: ${e.message}")
        }

        if (httpResponse.status != HttpStatusCode.OK) {
            throw AuthenticationException("Erro na API Sankhya: ${httpResponse.status.value} ${httpResponse.status.description}")
        }

        // Trata a leitura dos bytes suportando encoding Windows-1252 / UTF-8
        val bytes = httpResponse.readBytes()
        val textResponse = try {
            String(bytes, Charset.forName("Windows-1252"))
        } catch (e: Exception) {
            String(bytes, Charsets.UTF_8)
        }

        val parsedData = try {
            Json { ignoreUnknownKeys = true; isLenient = true }.decodeFromString<SankhyaLoginResponseDto>(textResponse)
        } catch (e: Exception) {
            logger.error("Falha ao efetuar parse do JSON retornado pelo Sankhya", e)
            throw AuthenticationException("Resposta inválida do servidor Sankhya (JSON malformado).")
        }

        if (parsedData.status != "1") {
            val errorMsg = parsedData.statusMessage ?: "Erro desconhecido no login."
            logger.warn("Sankhya login recusado com mensagem: {}", errorMsg)
            throw AuthenticationException(errorMsg)
        }

        val responseBody = parsedData.responseBody
            ?: throw AuthenticationException("Resposta do servidor incompleta (responseBody ausente).")

        if (responseBody.jsessionid?.`$` == null) {
            throw AuthenticationException("Resposta do servidor incompleta (jsessionid ausente).")
        }

        return parsedData
    }

    override suspend fun logout(jsessionid: String, server: String): Boolean {
        if (jsessionid.isBlank()) return true

        val baseUrl = if (server.equals("producao", ignoreCase = true)) prodUrl else treinaUrl
        val url = "$baseUrl/mge/service.sbr?serviceName=MobileLoginSP.logout&mgeSession=$jsessionid&outputType=json"

        logger.info("Enviando requisição de logout para o ERP Sankhya para a sessão: {}", jsessionid)

        return try {
            val response: HttpResponse = httpClient.post(url) {
                header(HttpHeaders.Cookie, "JSESSIONID=$jsessionid")
                contentType(ContentType.Application.Json)
                setBody(mapOf("serviceName" to "MobileLoginSP.logout"))
            }
            logger.info("Resposta do logout no Sankhya: {}", response.status)
            response.status == HttpStatusCode.OK
        } catch (e: Exception) {
            logger.error("Erro ao realizar logout no ERP Sankhya: {}", e.message)
            false
        }
    }

    fun parseIdUsu(rawIdUsu: String?): String {
        if (rawIdUsu.isNull_or_empty()) return "0"
        return try {
            String(Base64.getDecoder().decode(rawIdUsu), Charsets.UTF_8)
        } catch (e: Exception) {
            rawIdUsu ?: "0"
        }
    }
}

private fun String?.isNull_or_empty(): Boolean = this == null || this.trim().isEmpty()
