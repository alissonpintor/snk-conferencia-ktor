package com.snk.conferencia.shared.sankhya

import io.ktor.client.*
import io.ktor.client.engine.mock.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNotNull
import kotlin.test.assertTrue

class SankhyaClientTest {

    private fun createMockClient(
        mockStatus: HttpStatusCode = HttpStatusCode.OK,
        responseContent: String = ""
    ): HttpClient {
        val engine = MockEngine { request ->
            val cookieHeader = request.headers[HttpHeaders.Cookie]
            assertTrue(cookieHeader != null && cookieHeader.contains("JSESSIONID=test-session-123"))

            respond(
                content = responseContent,
                status = mockStatus,
                headers = headersOf(HttpHeaders.ContentType, ContentType.Application.Json.toString())
            )
        }

        return HttpClient(engine) {
            install(ContentNegotiation) {
                json(Json {
                    prettyPrint = true
                    isLenient = true
                    ignoreUnknownKeys = true
                })
            }
        }
    }

    @Test
    fun `deve executar servico com sucesso quando status for 1`() {
        runBlocking {
            val successJson = """
                {
                    "status": "1",
                    "statusMessage": "Sucesso",
                    "responseBody": {
                        "result": "OK"
                    }
                }
            """.trimIndent()

            val mockHttpClient = createMockClient(responseContent = successJson)
            val client = SankhyaClient(mockHttpClient)

            val response = client.callService(
                baseUrl = "https://teste.stoky.com.br",
                serviceName = "DbExplorerSP.executeQuery",
                jsessionid = "test-session-123",
                requestBody = buildJsonObject { put("sql", "SELECT 1 FROM DUAL") }
            )

            assertEquals("1", response.status)
            assertNotNull(response.responseBody)
        }
    }

    @Test
    fun `deve lancar SankhyaBusinessException quando status for 0`() {
        val errorJson = """
            {
                "status": "0",
                "statusMessage": "Sessão inválida ou expirada",
                "responseBody": {}
            }
        """.trimIndent()

        val mockHttpClient = createMockClient(responseContent = errorJson)
        val client = SankhyaClient(mockHttpClient)

        val exception = assertFailsWith<SankhyaBusinessException> {
            runBlocking {
                client.callService(
                    baseUrl = "https://teste.stoky.com.br",
                    serviceName = "DbExplorerSP.executeQuery",
                    jsessionid = "test-session-123",
                    requestBody = buildJsonObject { put("sql", "SELECT 1 FROM DUAL") }
                )
            }
        }

        assertEquals("Sessão inválida ou expirada", exception.message)
        assertEquals("0", exception.statusCode)
    }

    @Test
    fun `deve lancar SankhyaBusinessException quando HTTP status for nao-OK`() {
        val mockHttpClient = createMockClient(mockStatus = HttpStatusCode.InternalServerError, responseContent = "Internal Server Error")
        val client = SankhyaClient(mockHttpClient)

        val exception = assertFailsWith<SankhyaBusinessException> {
            runBlocking {
                client.callService(
                    baseUrl = "https://teste.stoky.com.br",
                    serviceName = "DbExplorerSP.executeQuery",
                    jsessionid = "test-session-123",
                    requestBody = buildJsonObject { put("sql", "SELECT 1 FROM DUAL") }
                )
            }
        }

        assertTrue(exception.message.contains("HTTP 500"))
    }

    @Test
    fun `deve lancar SankhyaBusinessException quando JSON for malformado`() {
        val malformedJson = "{ invalid json content }"
        val mockHttpClient = createMockClient(responseContent = malformedJson)
        val client = SankhyaClient(mockHttpClient)

        val exception = assertFailsWith<SankhyaBusinessException> {
            runBlocking {
                client.callService(
                    baseUrl = "https://teste.stoky.com.br",
                    serviceName = "DbExplorerSP.executeQuery",
                    jsessionid = "test-session-123",
                    requestBody = buildJsonObject { put("sql", "SELECT 1 FROM DUAL") }
                )
            }
        }

        assertTrue(exception.message.contains("formato JSON inválido"))
    }

    @Test
    fun `deve relancar CancellationException sem encapsular`() {
        val engine = MockEngine {
            throw CancellationException("Coroutine cancelada")
        }
        val mockHttpClient = HttpClient(engine) {
            install(ContentNegotiation) {
                json(Json { ignoreUnknownKeys = true })
            }
        }
        val client = SankhyaClient(mockHttpClient)

        assertFailsWith<CancellationException> {
            runBlocking {
                client.callService(
                    baseUrl = "https://teste.stoky.com.br",
                    serviceName = "DbExplorerSP.executeQuery",
                    jsessionid = "test-session-123",
                    requestBody = buildJsonObject { put("sql", "SELECT 1 FROM DUAL") }
                )
            }
        }
    }

    @Test
    fun `deve executar query SQL via executeQuery`() {
        runBlocking {
            val queryJson = """
                {
                    "status": "1",
                    "statusMessage": null,
                    "responseBody": {
                        "records": { "record": [] }
                    }
                }
            """.trimIndent()

            val mockHttpClient = createMockClient(responseContent = queryJson)
            val client = SankhyaClient(mockHttpClient)

            val response = client.executeQuery(
                baseUrl = "https://teste.stoky.com.br",
                jsessionid = "test-session-123",
                sql = "SELECT CODEMP, NOMEFANTASIA FROM TSIEMP"
            )

            assertEquals("1", response.status)
        }
    }

    @Test
    fun `deve salvar registro via saveRecord`() {
        runBlocking {
            val saveJson = """
                {
                    "status": "1",
                    "statusMessage": "Registro salvo",
                    "responseBody": {
                        "pk": { "CODEMP": "1" }
                    }
                }
            """.trimIndent()

            val mockHttpClient = createMockClient(responseContent = saveJson)
            val client = SankhyaClient(mockHttpClient)

            val response = client.saveRecord(
                baseUrl = "https://teste.stoky.com.br",
                jsessionid = "test-session-123",
                entityName = "Empresa",
                fields = buildJsonObject { put("NOMEMP", "Empresa Teste") }
            )

            assertEquals("1", response.status)
        }
    }
}
