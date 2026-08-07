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
        override suspend fun buscarConferencia(baseUrl: String, jsessionid: String, request: BuscarConferenciaRequest): List<ConferenciaResponse> {
            if (request.checkout.isNullOrBlank() && request.nroConferencia == null) throw IllegalArgumentException("Filtro obrigatório.")
            return listOf(ConferenciaResponse(nroConferencia = 979160L, nroSeparacao = 1001L, nroUnico = 2001L, nroNota = 3001L))
        }

        override suspend fun iniciarConferencia(baseUrl: String, jsessionid: String, userId: String, request: IniciarConferenciaRequest): List<IniciarConferenciaResponse> {
            if (request.checkout.isBlank()) throw IllegalArgumentException("Checkout obrigatório.")
            return listOf(IniciarConferenciaResponse(nroConferencia = 979160L, tipoConferencia = "E"))
        }

        override suspend fun buscarTarefasPendentes(baseUrl: String, jsessionid: String, userId: String): List<ConferenciaPendenteResponse> {
            return listOf(ConferenciaPendenteResponse(nroConferencia = 979160L, nroSeparacao = 1001L))
        }

        override suspend fun buscarItensConferencia(baseUrl: String, jsessionid: String, nroConferencia: Long, codProduto: Long?, codBarra: String?): List<ItemConferenciaResponse> {
            if (nroConferencia <= 0) throw IllegalArgumentException("Número de conferência inválido.")
            return listOf(ItemConferenciaResponse(codProduto = 1001L, descrProduto = "PRODUTO TESTE", quantidade = 10.0))
        }

        override suspend fun obterInfoProduto(baseUrl: String, jsessionid: String, userId: String, request: InfoProdutoRequest): InfoProdutoResponse {
            if (request.nroConferencia <= 0 || request.codBarra.isBlank()) throw IllegalArgumentException("Parâmetros inválidos.")
            return InfoProdutoResponse(1001L, "PRODUTO TESTE")
        }

        override suspend fun registrarItemConferido(baseUrl: String, jsessionid: String, userId: String, request: RegistrarItemConferidoRequest): RegistrarItemResponse {
            if (request.nroConferencia <= 0 || request.codBarra.isBlank()) throw IllegalArgumentException("Parâmetros inválidos.")
            return RegistrarItemResponse(status = "OK")
        }

        override suspend fun atualizarSaldoItem(baseUrl: String, jsessionid: String, request: AtualizarSaldoRequest): List<SaldoItemResponse> {
            if (request.nroConferencia <= 0) throw IllegalArgumentException("Número de conferência obrigatório.")
            return listOf(SaldoItemResponse(codProduto = 1001L, qtdadeConferida = 5.0))
        }

        override suspend fun removerItens(baseUrl: String, jsessionid: String, userId: String, request: RemoverItensRequest): ConferenciaActionResponse {
            if (request.nroConferencia <= 0) throw IllegalArgumentException("Número de conferência obrigatório.")
            return ConferenciaActionResponse(mensagem = "Removido com sucesso")
        }

        override suspend fun finalizarConferencia(baseUrl: String, jsessionid: String, userId: String, request: FinalizarConferenciaRequest): FinalizarConferenciaResponse {
            if (request.nroConferencia <= 0) throw IllegalArgumentException("Número de conferência obrigatório.")
            return FinalizarConferenciaResponse(nroConferencia = request.nroConferencia, status = "1")
        }

        override suspend fun registrarVolumes(baseUrl: String, jsessionid: String, userId: String, request: RegistrarVolumesRequest): ConferenciaActionResponse {
            if (request.nroConferencia <= 0 || request.quantidade <= 0) throw IllegalArgumentException("Parâmetros inválidos.")
            return ConferenciaActionResponse(mensagem = "Volumes registrados com sucesso")
        }

        override suspend fun enviarParaDoca(baseUrl: String, jsessionid: String, userId: String, request: EnviarDocaRequest): ConferenciaActionResponse {
            val nroNota = request.nroNota ?: 0L
            if (request.nroConferencia <= 0 || nroNota <= 0) throw IllegalArgumentException("Parâmetros inválidos para envio à doca.")
            return ConferenciaActionResponse(mensagem = "Enviado para doca")
        }

        override suspend fun cancelarConferencia(baseUrl: String, jsessionid: String, userId: String, request: CancelarConferenciaRequest): ConferenciaActionResponse {
            if (request.nroConferencia <= 0) throw IllegalArgumentException("Número de conferência inválido.")
            return ConferenciaActionResponse(mensagem = "Cancelado com sucesso")
        }

        override suspend fun imprimirVolumes(baseUrl: String, jsessionid: String, request: ImprimirVolumesRequest): String {
            val nroUnico = request.nroUnico ?: 0L
            val nroSeparacao = request.nroSeparacao ?: 0L
            if (nroUnico <= 0 || nroSeparacao <= 0) throw IllegalArgumentException("Número único e número de separação são obrigatórios.")
            return "<html><body>Etiquetas</body></html>"
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
    fun `deve retornar HTTP 200 ao buscar conferencia`() = testApplication {
        environment { config = MapApplicationConfig() }
        application { setupTestModule() }
        val client = createClient { install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) { json(Json { prettyPrint = true }) } }

        val response = client.post("/api/v1/conferencia/search") {
            cookie("JSESSIONID", "session-123")
            contentType(ContentType.Application.Json)
            setBody(BuscarConferenciaRequest(checkout = "02.904.258"))
        }

        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(response.bodyAsText().contains("979160"))
    }

    @Test
    fun `deve retornar HTTP 200 ao iniciar conferencia`() = testApplication {
        environment { config = MapApplicationConfig() }
        application { setupTestModule() }
        val client = createClient { install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) { json(Json { prettyPrint = true }) } }

        val response = client.post("/api/v1/conferencia/iniciar") {
            cookie("JSESSIONID", "session-123")
            header("X-User-Id", "15")
            contentType(ContentType.Application.Json)
            setBody(IniciarConferenciaRequest(checkout = "02.904.258"))
        }

        assertEquals(HttpStatusCode.OK, response.status)
    }

    @Test
    fun `deve retornar HTTP 200 ao buscar tarefas pendentes`() = testApplication {
        environment { config = MapApplicationConfig() }
        application { setupTestModule() }
        val client = createClient { install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) { json(Json { prettyPrint = true }) } }

        val response = client.get("/api/v1/conferencia/pendentes") {
            cookie("JSESSIONID", "session-123")
            header("X-User-Id", "15")
        }

        assertEquals(HttpStatusCode.OK, response.status)
    }

    @Test
    fun `deve retornar HTTP 200 ao buscar itens da conferencia`() = testApplication {
        environment { config = MapApplicationConfig() }
        application { setupTestModule() }
        val client = createClient { install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) { json(Json { prettyPrint = true }) } }

        val response = client.post("/api/v1/conferencia/itens") {
            cookie("JSESSIONID", "session-123")
            contentType(ContentType.Application.Json)
            setBody(BuscarItensConferenciaRequest(nroConferencia = 979160L))
        }

        assertEquals(HttpStatusCode.OK, response.status)
    }

    @Test
    fun `deve retornar HTTP 200 ao obter info do produto`() = testApplication {
        environment { config = MapApplicationConfig() }
        application { setupTestModule() }
        val client = createClient { install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) { json(Json { prettyPrint = true }) } }

        val response = client.post("/api/v1/conferencia/info") {
            cookie("JSESSIONID", "session-123")
            header("X-User-Id", "15")
            contentType(ContentType.Application.Json)
            setBody(InfoProdutoRequest(nroConferencia = 979160L, codBarra = "7891234567890", quantidade = 1.0))
        }

        assertEquals(HttpStatusCode.OK, response.status)
    }

    @Test
    fun `deve retornar HTTP 200 ao registrar item conferido`() = testApplication {
        environment { config = MapApplicationConfig() }
        application { setupTestModule() }
        val client = createClient { install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) { json(Json { prettyPrint = true }) } }

        val response = client.post("/api/v1/conferencia/registrar") {
            cookie("JSESSIONID", "session-123")
            header("X-User-Id", "15")
            contentType(ContentType.Application.Json)
            setBody(RegistrarItemConferidoRequest(nroConferencia = 979160L, codBarra = "7891234567890", quantidade = 1.0))
        }

        assertEquals(HttpStatusCode.OK, response.status)
    }

    @Test
    fun `deve retornar HTTP 200 ao atualizar saldo de item`() = testApplication {
        environment { config = MapApplicationConfig() }
        application { setupTestModule() }
        val client = createClient { install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) { json(Json { prettyPrint = true }) } }

        val response = client.post("/api/v1/conferencia/itens/saldo") {
            cookie("JSESSIONID", "session-123")
            contentType(ContentType.Application.Json)
            setBody(AtualizarSaldoRequest(nroConferencia = 979160L))
        }

        assertEquals(HttpStatusCode.OK, response.status)
    }

    @Test
    fun `deve retornar HTTP 200 ao remover itens`() = testApplication {
        environment { config = MapApplicationConfig() }
        application { setupTestModule() }
        val client = createClient { install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) { json(Json { prettyPrint = true }) } }

        val response = client.post("/api/v1/conferencia/remover-itens") {
            cookie("JSESSIONID", "session-123")
            header("X-User-Id", "15")
            contentType(ContentType.Application.Json)
            setBody(RemoverItensRequest(nroConferencia = 979160L))
        }

        assertEquals(HttpStatusCode.OK, response.status)
    }

    @Test
    fun `deve retornar HTTP 200 ao finalizar conferencia`() = testApplication {
        environment { config = MapApplicationConfig() }
        application { setupTestModule() }
        val client = createClient { install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) { json(Json { prettyPrint = true }) } }

        val response = client.post("/api/v1/conferencia/finalizar") {
            cookie("JSESSIONID", "session-123")
            header("X-User-Id", "15")
            contentType(ContentType.Application.Json)
            setBody(FinalizarConferenciaRequest(nroConferencia = 979160L))
        }

        assertEquals(HttpStatusCode.OK, response.status)
    }

    @Test
    fun `deve retornar HTTP 200 ao registrar volumes`() = testApplication {
        environment { config = MapApplicationConfig() }
        application { setupTestModule() }
        val client = createClient { install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) { json(Json { prettyPrint = true }) } }

        val response = client.post("/api/v1/conferencia/volumes") {
            cookie("JSESSIONID", "session-123")
            header("X-User-Id", "15")
            contentType(ContentType.Application.Json)
            setBody(RegistrarVolumesRequest(nroConferencia = 979160L, quantidade = 2))
        }

        assertEquals(HttpStatusCode.OK, response.status)
    }

    @Test
    fun `deve retornar HTTP 200 ao enviar para doca`() = testApplication {
        environment { config = MapApplicationConfig() }
        application { setupTestModule() }
        val client = createClient { install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) { json(Json { prettyPrint = true }) } }

        val response = client.post("/api/v1/conferencia/doca") {
            cookie("JSESSIONID", "session-123")
            header("X-User-Id", "15")
            contentType(ContentType.Application.Json)
            setBody(EnviarDocaRequest(nroConferencia = 4001L, nroNota = 3001L))
        }

        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(response.bodyAsText().contains("Enviado para doca"))
    }

    @Test
    fun `deve retornar HTTP 200 ao cancelar conferencia`() = testApplication {
        environment { config = MapApplicationConfig() }
        application { setupTestModule() }
        val client = createClient { install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) { json(Json { prettyPrint = true }) } }

        val response = client.post("/api/v1/conferencia/cancelar") {
            cookie("JSESSIONID", "session-123")
            header("X-User-Id", "15")
            contentType(ContentType.Application.Json)
            setBody(CancelarConferenciaRequest(nroConferencia = 4001L))
        }

        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(response.bodyAsText().contains("Cancelado com sucesso"))
    }

    @Test
    fun `deve retornar HTTP 200 ao solicitar impressao de volumes`() = testApplication {
        environment { config = MapApplicationConfig() }
        application { setupTestModule() }
        val client = createClient { install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) { json(Json { prettyPrint = true }) } }

        val response = client.post("/api/v1/conferencia/volumes/imprimir") {
            cookie("JSESSIONID", "session-123")
            contentType(ContentType.Application.Json)
            setBody(ImprimirVolumesRequest(nroUnico = 2001L, nroSeparacao = 1001L))
        }

        assertEquals(HttpStatusCode.OK, response.status)
        assertTrue(response.bodyAsText().contains("Etiquetas"))
    }

    @Test
    fun `deve retornar HTTP 400 ao enviar para doca com nroConferencia invalido`() = testApplication {
        environment { config = MapApplicationConfig() }
        application { setupTestModule() }
        val client = createClient { install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) { json(Json { prettyPrint = true }) } }

        val response = client.post("/api/v1/conferencia/doca") {
            cookie("JSESSIONID", "session-123")
            header("X-User-Id", "15")
            contentType(ContentType.Application.Json)
            setBody(EnviarDocaRequest(nroConferencia = 0L, nroNota = 3001L))
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
    }
}
