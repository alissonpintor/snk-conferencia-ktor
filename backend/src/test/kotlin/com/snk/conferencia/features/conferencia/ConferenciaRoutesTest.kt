package com.snk.conferencia.features.conferencia

import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.config.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.testing.*
import kotlinx.serialization.json.Json
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class ConferenciaRoutesTest {

    private class FakeConferenciaService : ConferenciaServiceInterface {
        override suspend fun enviarParaDoca(
            baseUrl: String,
            jsessionid: String,
            userId: String,
            request: EnviarDocaRequest
        ): ConferenciaActionResponse {
            if (request.nroConferencia <= 0 || request.nroNota <= 0) throw IllegalArgumentException("Parâmetros inválidos para envio à doca.")
            return ConferenciaActionResponse(mensagem = "Enviado para doca")
        }

        override suspend fun cancelarConferencia(
            baseUrl: String,
            jsessionid: String,
            userId: String,
            request: CancelarConferenciaRequest
        ): ConferenciaActionResponse {
            if (request.nroConferencia <= 0) throw IllegalArgumentException("Número de conferência inválido.")
            return ConferenciaActionResponse(mensagem = "Cancelado com sucesso")
        }

        override suspend fun imprimirVolumes(
            baseUrl: String,
            jsessionid: String,
            request: ImprimirVolumesRequest
        ): ConferenciaActionResponse {
            if (request.nroUnico <= 0 || request.nroSeparacao <= 0) throw IllegalArgumentException("Número único e número de separação são obrigatórios.")
            return ConferenciaActionResponse(mensagem = "Impressao enviada")
        }
    }

    private fun Application.setupTestModule() {
        if (pluginOrNull(ContentNegotiation) == null) {
            install(ContentNegotiation) {
                json(Json { prettyPrint = true })
            }
        }
        if (pluginOrNull(StatusPages) == null) {
            install(StatusPages) {
                exception<IllegalArgumentException> { call, cause ->
                    call.respond(HttpStatusCode.BadRequest, mapOf("error" to cause.message))
                }
            }
        }
        routing {
            conferenciaRoutes(FakeConferenciaService())
        }
    }

    @Test
    fun `deve retornar HTTP 200 ao enviar para doca`() = testApplication {
        environment {
            config = MapApplicationConfig()
        }
        application {
            setupTestModule()
        }

        val client = createClient {
            install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) {
                json(Json { prettyPrint = true })
            }
        }

        val response = client.post("/api/v1/conferencia/doca") {
            cookie("JSESSIONID", "session-123")
            header("X-User-Id", "15")
            contentType(ContentType.Application.Json)
            setBody(EnviarDocaRequest(nroConferencia = 4001L, nroNota = 3001L))
        }

        assertEquals(HttpStatusCode.OK, response.status)
        val body = response.bodyAsText()
        assertTrue(body.contains("Enviado para doca"))
    }

    @Test
    fun `deve retornar HTTP 200 ao cancelar conferencia`() = testApplication {
        environment {
            config = MapApplicationConfig()
        }
        application {
            setupTestModule()
        }

        val client = createClient {
            install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) {
                json(Json { prettyPrint = true })
            }
        }

        val response = client.post("/api/v1/conferencia/cancelar") {
            cookie("JSESSIONID", "session-123")
            header("X-User-Id", "15")
            contentType(ContentType.Application.Json)
            setBody(CancelarConferenciaRequest(nroConferencia = 4001L))
        }

        assertEquals(HttpStatusCode.OK, response.status)
        val body = response.bodyAsText()
        assertTrue(body.contains("Cancelado com sucesso"))
    }

    @Test
    fun `deve retornar HTTP 200 ao solicitar impressao de volumes`() = testApplication {
        environment {
            config = MapApplicationConfig()
        }
        application {
            setupTestModule()
        }

        val client = createClient {
            install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) {
                json(Json { prettyPrint = true })
            }
        }

        val response = client.post("/api/v1/conferencia/volumes/imprimir") {
            cookie("JSESSIONID", "session-123")
            contentType(ContentType.Application.Json)
            setBody(ImprimirVolumesRequest(nroUnico = 2001L, nroSeparacao = 1001L))
        }

        assertEquals(HttpStatusCode.OK, response.status)
        val body = response.bodyAsText()
        assertTrue(body.contains("Impressao enviada"))
    }

    @Test
    fun `deve retornar HTTP 400 ao enviar para doca com nroConferencia invalido`() = testApplication {
        environment {
            config = MapApplicationConfig()
        }
        application {
            setupTestModule()
        }

        val client = createClient {
            install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) {
                json(Json { prettyPrint = true })
            }
        }

        val response = client.post("/api/v1/conferencia/doca") {
            cookie("JSESSIONID", "session-123")
            header("X-User-Id", "15")
            contentType(ContentType.Application.Json)
            setBody(EnviarDocaRequest(nroConferencia = 0L, nroNota = 3001L))
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
    }
}
