package com.snk.conferencia.auth

import com.snk.conferencia.module
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.testing.*
import kotlinx.serialization.json.Json
import org.junit.jupiter.api.Test
import java.io.File
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class AuthIntegrationTest {

    private fun getEnvVar(key: String, defaultValue: String): String {
        val envVal = System.getenv(key)
        if (!envVal.isNullOrBlank()) return envVal

        val envFiles = listOf(File("../.env"), File(".env"))
        for (envFile in envFiles) {
            if (envFile.exists()) {
                envFile.readLines().forEach { line ->
                    val trimmed = line.trim()
                    if (trimmed.startsWith("$key=")) {
                        val value = trimmed.substringAfter("=").trim('"').trim('\'')
                        if (value.isNotBlank()) return value
                    }
                }
            }
        }
        return defaultValue
    }

    @Test
    fun `deve realizar login no endpoint Ktor com credenciais do Sankhya`() = testApplication {
        application {
            module()
        }

        val testUser = getEnvVar("USUARIO_SANKHYA", "alisson")
        val testPassword = getEnvVar("PASSWORD_SANKHYA", "studiowork")

        val client = createClient {
            install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) {
                json(Json { ignoreUnknownKeys = true })
            }
        }

        val response = client.post("/api/v1/auth/login") {
            contentType(ContentType.Application.Json)
            setBody(
                AuthCredentialsDto(
                    username = testUser,
                    password = testPassword,
                    server = "producao"
                )
            )
        }

        assertEquals(HttpStatusCode.OK, response.status)

        val responseText = response.bodyAsText()
        assertTrue(responseText.contains("token"), "Resposta deve conter o token JWT")
        assertTrue(responseText.contains(testUser), "Resposta deve conter o nome do usuário")

        val tokenResponse = Json { ignoreUnknownKeys = true }.decodeFromString<TokenResponseDto>(responseText)

        // Testar verificação da sessão enviando o token gerado
        val verifyResponse = client.get("/api/v1/auth/verify") {
            header(HttpHeaders.Authorization, "Bearer ${tokenResponse.token}")
        }

        assertEquals(HttpStatusCode.OK, verifyResponse.status)
        val verifyText = verifyResponse.bodyAsText()
        assertTrue(verifyText.contains(testUser))
    }

    @Test
    fun `deve retornar HTTP 401 quando o token for ausente no verify`() = testApplication {
        application {
            module()
        }

        val response = client.get("/api/v1/auth/verify")
        assertEquals(HttpStatusCode.Unauthorized, response.status)
    }

    @Test
    fun `deve responder HTTP 200 no logout`() = testApplication {
        application {
            module()
        }

        val response = client.post("/api/v1/auth/logout")
        assertEquals(HttpStatusCode.OK, response.status)
    }

    @Test
    fun `deve carregar a documentacao do Swagger UI na rota swagger`() = testApplication {
        application {
            module()
        }

        val response = client.get("/swagger")
        assertEquals(HttpStatusCode.OK, response.status)
    }
}
