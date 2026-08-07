package com.snk.conferencia.features.lookup

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

class LookupRoutesTest {

    private class FakeLookupService : LookupServiceInterface {
        override suspend fun buscarEmpresas(baseUrl: String, jsessionid: String): List<EmpresaResponse> {
            return listOf(EmpresaResponse("1", "Empresa Teste", "Razao Social Teste"))
        }

        override suspend fun buscarParceiros(baseUrl: String, jsessionid: String, busca: String?): List<ParceiroResponse> {
            if (busca.isNull_or_blank()) return emptyList()
            return listOf(ParceiroResponse("10", "Parceiro Teste", "Razao Social Parceiro"))
        }

        override suspend fun buscarProdutos(baseUrl: String, jsessionid: String, busca: String?): List<ProdutoResponse> {
            if (busca.isNull_or_blank()) return emptyList()
            return listOf(ProdutoResponse("100", "Produto Teste", "Marca Teste"))
        }
    }

    @Test
    fun `deve retornar HTTP 200 e lista de empresas`() = testApplication {
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
                lookupRoutes(FakeLookupService())
            }
        }

        val response = client.get("/api/v1/empresas") {
            cookie("JSESSIONID", "session-123")
        }

        assertEquals(HttpStatusCode.OK, response.status)
        val body = response.bodyAsText()
        assertTrue(body.contains("Empresa Teste"))
    }

    @Test
    fun `deve retornar HTTP 200 e lista de parceiros filtrados`() = testApplication {
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
                lookupRoutes(FakeLookupService())
            }
        }

        val response = client.get("/api/v1/parceiros?q=parceiro") {
            cookie("JSESSIONID", "session-123")
        }

        assertEquals(HttpStatusCode.OK, response.status)
        val body = response.bodyAsText()
        assertTrue(body.contains("Parceiro Teste"))
    }

    @Test
    fun `deve retornar HTTP 200 e lista de produtos filtrados`() = testApplication {
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
                lookupRoutes(FakeLookupService())
            }
        }

        val response = client.get("/api/v1/produtos?q=produto") {
            cookie("JSESSIONID", "session-123")
        }

        assertEquals(HttpStatusCode.OK, response.status)
        val body = response.bodyAsText()
        assertTrue(body.contains("Produto Teste"))
    }
}

private fun String?.isNull_or_blank(): Boolean = this == null || this.trim().isEmpty()
