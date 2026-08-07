package com.snk.conferencia.features.separacao

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
import kotlin.test.assertTrue

class SeparacaoRoutesTest {

    private class FakeSeparacaoService : SeparacaoServiceInterface {
        override suspend fun buscarSeparacoes(
            baseUrl: String,
            jsessionid: String,
            filtros: SeparacaoFilterRequest
        ): List<SeparacaoResponse> {
            if (filtros.empresa == null && filtros.nroSeparacao == null) {
                throw IllegalArgumentException("Informe pelo menos um filtro.")
            }
            return listOf(
                SeparacaoResponse(
                    codEmp = 1L,
                    nroSeparacao = 1001L,
                    nroUnico = 2001L,
                    nroNota = 3001L,
                    codParc = 10L,
                    nomeParc = "Parceiro Teste"
                )
            )
        }

        override suspend fun buscarItens(
            baseUrl: String,
            jsessionid: String,
            nroSeparacao: Long
        ): List<ItemSeparacaoResponse> {
            return listOf(
                ItemSeparacaoResponse(
                    nroSeparacao = nroSeparacao,
                    codProduto = 7700L,
                    descricaoProduto = "Produto Teste",
                    quantidade = 5.0
                )
            )
        }

        override suspend fun obterQuantidadeVolumes(
            baseUrl: String,
            jsessionid: String,
            nroSeparacao: Long
        ): QuantidadeVolumesResponse {
            return QuantidadeVolumesResponse(nroSeparacao = nroSeparacao, quantidade = 4)
        }

        override suspend fun gerarVolumes(
            baseUrl: String,
            jsessionid: String,
            nroSeparacao: Long,
            request: GerarVolumesRequest
        ): GerarVolumesResponse {
            if (request.quantidade <= 0) {
                throw IllegalArgumentException("Quantidade invalida.")
            }
            return GerarVolumesResponse(
                nroSeparacao = nroSeparacao,
                status = "1",
                mensagem = "Volumes gerados com sucesso."
            )
        }
    }

    @Test
    fun `deve retornar HTTP 200 e lista de separacoes na busca`() = testApplication {
        environment {
            config = MapApplicationConfig()
        }
        application {
            if (pluginOrNull(ContentNegotiation) == null) {
                install(ContentNegotiation) {
                    json(Json { prettyPrint = true })
                }
            }
            routing {
                separacaoRoutes(FakeSeparacaoService())
            }
        }

        val client = createClient {
            install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) {
                json(Json { prettyPrint = true })
            }
        }

        val response = client.post("/api/v1/separacoes/search") {
            cookie("JSESSIONID", "session-123")
            contentType(ContentType.Application.Json)
            setBody(SeparacaoFilterRequest(empresa = 1L))
        }

        assertEquals(HttpStatusCode.OK, response.status)
        val body = response.bodyAsText()
        assertTrue(body.contains("1001"))
        assertTrue(body.contains("Parceiro Teste"))
    }

    @Test
    fun `deve retornar HTTP 200 e lista de itens da separacao`() = testApplication {
        environment {
            config = MapApplicationConfig()
        }
        application {
            if (pluginOrNull(ContentNegotiation) == null) {
                install(ContentNegotiation) {
                    json(Json { prettyPrint = true })
                }
            }
            routing {
                separacaoRoutes(FakeSeparacaoService())
            }
        }

        val response = client.get("/api/v1/separacoes/1001/itens") {
            cookie("JSESSIONID", "session-123")
        }

        assertEquals(HttpStatusCode.OK, response.status)
        val body = response.bodyAsText()
        assertTrue(body.contains("Produto Teste"))
    }

    @Test
    fun `deve retornar HTTP 200 e quantidade de volumes da separacao`() = testApplication {
        environment {
            config = MapApplicationConfig()
        }
        application {
            if (pluginOrNull(ContentNegotiation) == null) {
                install(ContentNegotiation) {
                    json(Json { prettyPrint = true })
                }
            }
            routing {
                separacaoRoutes(FakeSeparacaoService())
            }
        }

        val response = client.get("/api/v1/separacoes/1001/volumes/quantidade") {
            cookie("JSESSIONID", "session-123")
        }

        assertEquals(HttpStatusCode.OK, response.status)
        val body = response.bodyAsText()
        assertTrue(body.contains("\"quantidade\": 4") || body.contains("\"quantidade\":4"))
    }

    @Test
    fun `deve retornar HTTP 201 e status na geracao de volumes`() = testApplication {
        environment {
            config = MapApplicationConfig()
        }
        application {
            if (pluginOrNull(ContentNegotiation) == null) {
                install(ContentNegotiation) {
                    json(Json { prettyPrint = true })
                }
            }
            routing {
                separacaoRoutes(FakeSeparacaoService())
            }
        }

        val client = createClient {
            install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) {
                json(Json { prettyPrint = true })
            }
        }

        val response = client.post("/api/v1/separacoes/1001/volumes") {
            cookie("JSESSIONID", "session-123")
            contentType(ContentType.Application.Json)
            setBody(GerarVolumesRequest(nroConferencia = 4001L, quantidade = 2))
        }

        assertEquals(HttpStatusCode.Created, response.status)
        val body = response.bodyAsText()
        assertTrue(body.contains("Volumes gerados com sucesso."))
    }

    @Test
    fun `deve retornar HTTP 400 se o numero de separacao for invalido`() = testApplication {
        environment {
            config = MapApplicationConfig()
        }
        application {
            if (pluginOrNull(ContentNegotiation) == null) {
                install(ContentNegotiation) {
                    json(Json { prettyPrint = true })
                }
            }
            routing {
                separacaoRoutes(FakeSeparacaoService())
            }
        }

        val response = client.get("/api/v1/separacoes/invalid-id/itens") {
            cookie("JSESSIONID", "session-123")
        }

        assertEquals(HttpStatusCode.BadRequest, response.status)
    }
}
