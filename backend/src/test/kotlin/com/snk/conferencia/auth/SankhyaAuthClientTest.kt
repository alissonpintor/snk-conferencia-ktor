package com.snk.conferencia.auth

import com.snk.conferencia.plugins.AuthenticationException
import io.ktor.client.*
import io.ktor.client.engine.mock.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.json
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.Json
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class SankhyaAuthClientTest {

    @Test
    fun `deve autenticar no Sankhya com sucesso usando MockEngine`() = runBlocking {
        val mockEngine = MockEngine { request ->
            respond(
                content = """
                    {
                        "serviceName": "MobileLoginSP.login",
                        "status": "1",
                        "responseBody": {
                            "jsessionid": { "$": "MOCK_JSESSION_ID_123" },
                            "idusu": { "$": "TVR5PQ==" }
                        }
                    }
                """.trimIndent(),
                status = HttpStatusCode.OK,
                headers = headersOf(HttpHeaders.ContentType, ContentType.Application.Json.toString())
            )
        }

        val client = HttpClient(mockEngine) {
            install(ContentNegotiation) {
                json(Json { ignoreUnknownKeys = true })
            }
        }

        val sankhyaClient = SankhyaAuthClient(httpClient = client)
        val credentials = AuthCredentialsDto("alisson", "pass123", "producao")
        val response = sankhyaClient.login(credentials)

        assertEquals("1", response.status)
        assertEquals("MOCK_JSESSION_ID_123", response.responseBody?.jsessionid?.`$`)
    }

    @Test
    fun `deve lancar AuthenticationException quando Sankhya retornar status 0`() = runBlocking {
        val mockEngine = MockEngine { _ ->
            respond(
                content = """
                    {
                        "serviceName": "MobileLoginSP.login",
                        "status": "0",
                        "statusMessage": "Usuário ou senha inválidos."
                    }
                """.trimIndent(),
                status = HttpStatusCode.OK,
                headers = headersOf(HttpHeaders.ContentType, ContentType.Application.Json.toString())
            )
        }

        val client = HttpClient(mockEngine) {
            install(ContentNegotiation) {
                json(Json { ignoreUnknownKeys = true })
            }
        }

        val sankhyaClient = SankhyaAuthClient(httpClient = client)
        val credentials = AuthCredentialsDto("user_errado", "pass_errado", "producao")

        val exception = assertThrows<AuthenticationException> {
            sankhyaClient.login(credentials)
        }

        assertTrue(exception.message?.isNotBlank() == true)
    }

    @Test
    fun `deve decodificar idusu em base64 corretamente`() {
        val client = SankhyaAuthClient()
        // "MTIz" em base64 e "123"
        val decoded = client.parseIdUsu("MTIz")
        assertEquals("123", decoded)
    }
}
