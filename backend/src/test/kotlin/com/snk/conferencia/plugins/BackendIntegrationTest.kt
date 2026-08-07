package com.snk.conferencia.plugins

import com.snk.conferencia.shared.sankhya.SankhyaBusinessException
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.config.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.routing.*
import io.ktor.server.testing.*
import kotlinx.serialization.json.Json
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

class BackendIntegrationTest {

    @Test
    fun `deve capturar SankhyaBusinessException e retornar HTTP 400 com payload estruturado`() = testApplication {
        environment {
            config = MapApplicationConfig()
        }
        application {
            if (pluginOrNull(ContentNegotiation) == null) {
                install(ContentNegotiation) {
                    json(Json { prettyPrint = true })
                }
            }
            configureStatusPages()
            routing {
                get("/test/sankhya-error") {
                    throw SankhyaBusinessException("Sessão expirada no ERP Sankhya")
                }
            }
        }

        val response = client.get("/test/sankhya-error")

        assertEquals(HttpStatusCode.BadRequest, response.status)
        val body = response.bodyAsText()
        assertTrue(body.contains("Erro Sankhya"))
        assertTrue(body.contains("Sessão expirada no ERP Sankhya"))
    }

    @Test
    fun `deve capturar IllegalArgumentException e retornar HTTP 400`() = testApplication {
        environment {
            config = MapApplicationConfig()
        }
        application {
            if (pluginOrNull(ContentNegotiation) == null) {
                install(ContentNegotiation) {
                    json(Json { prettyPrint = true })
                }
            }
            configureStatusPages()
            routing {
                get("/test/validation-error") {
                    throw IllegalArgumentException("Filtro obrigatorio nao informado")
                }
            }
        }

        val response = client.get("/test/validation-error")

        assertEquals(HttpStatusCode.BadRequest, response.status)
        val body = response.bodyAsText()
        assertTrue(body.contains("Requisição Inválida"))
        assertTrue(body.contains("Filtro obrigatorio nao informado"))
    }

    @Test
    fun `deve capturar excecoes nao tratadas e retornar HTTP 500 sem expor stack trace`() = testApplication {
        environment {
            config = MapApplicationConfig()
        }
        application {
            if (pluginOrNull(ContentNegotiation) == null) {
                install(ContentNegotiation) {
                    json(Json { prettyPrint = true })
                }
            }
            configureStatusPages()
            routing {
                get("/test/internal-error") {
                    throw NullPointerException("Simulacao de ponteiro nulo interno")
                }
            }
        }

        val response = client.get("/test/internal-error")

        assertEquals(HttpStatusCode.InternalServerError, response.status)
        val body = response.bodyAsText()
        assertTrue(body.contains("Erro Interno"))
        assertFalse(body.contains("NullPointerException"))
        assertFalse(body.contains("Simulacao de ponteiro nulo interno"))
    }
}
