package com.snk.conferencia.features.lookup

import com.snk.conferencia.shared.sankhya.SankhyaGenericResponse
import com.snk.conferencia.shared.sankhya.SankhyaClientInterface
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.buildJsonArray
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class LookupServiceTest {

    private class MockSankhyaClient(
        private val mockResponse: SankhyaGenericResponse
    ) : SankhyaClientInterface {
        var lastSqlExecuted: String? = null

        override suspend fun callService(
            baseUrl: String,
            serviceName: String,
            jsessionid: String,
            requestBody: kotlinx.serialization.json.JsonObject
        ): SankhyaGenericResponse = mockResponse

        override suspend fun executeQuery(
            baseUrl: String,
            jsessionid: String,
            sql: String
        ): SankhyaGenericResponse {
            lastSqlExecuted = sql
            return mockResponse
        }

        override suspend fun saveRecord(
            baseUrl: String,
            jsessionid: String,
            entityName: String,
            fields: kotlinx.serialization.json.JsonObject
        ): SankhyaGenericResponse = mockResponse
    }

    private fun createDbExplorerResponseBody(
        fields: List<String>,
        rows: List<List<String>>
    ) = buildJsonObject {
        put("fieldsMetadata", buildJsonArray {
            fields.forEach { name ->
                add(buildJsonObject { put("name", name) })
            }
        })
        put("rows", buildJsonArray {
            rows.forEach { row ->
                add(buildJsonArray {
                    row.forEach { valStr -> add(JsonPrimitive(valStr)) }
                })
            }
        })
    }

    @Test
    fun `deve buscar lista de empresas com sucesso`() = runBlocking {
        val jsonResponseBody = createDbExplorerResponseBody(
            fields = listOf("CODEMP", "NOMEFANTASIA", "RAZAOSOCIAL"),
            rows = listOf(
                listOf("1", "STOKY MATRIZ", "STOKY ATACADISTA LTDA"),
                listOf("2", "STOKY FILIAL", "STOKY LOGISTICA LTDA")
            )
        )
        val mockResponse = SankhyaGenericResponse(status = "1", responseBody = jsonResponseBody)
        val mockClient = MockSankhyaClient(mockResponse)
        val service = LookupService(mockClient)

        val resultado = service.buscarEmpresas("https://teste.stoky.com.br", "session-123")

        assertEquals(2, resultado.size)
        assertEquals("1", resultado[0].id)
        assertEquals("STOKY MATRIZ", resultado[0].title)
        assertEquals("STOKY ATACADISTA LTDA", resultado[0].subtitle)

        assertEquals("2", resultado[1].id)
        assertEquals("STOKY FILIAL", resultado[1].title)
    }

    @Test
    fun `deve buscar parceiro por codigo numerico`() = runBlocking {
        val jsonResponseBody = createDbExplorerResponseBody(
            fields = listOf("CODPARC", "NOMEPARC", "RAZAOSOCIAL"),
            rows = listOf(
                listOf("105", "PARCEIRO TESTE", "PARCEIRO TESTE LTDA")
            )
        )
        val mockResponse = SankhyaGenericResponse(status = "1", responseBody = jsonResponseBody)
        val mockClient = MockSankhyaClient(mockResponse)
        val service = LookupService(mockClient)

        val resultado = service.buscarParceiros("https://teste.stoky.com.br", "session-123", "105")

        assertEquals(1, resultado.size)
        assertEquals("105", resultado[0].id)
        assertEquals("PARCEIRO TESTE", resultado[0].title)
        assertTrue(mockClient.lastSqlExecuted!!.contains("CODPARC = 105"))
    }

    @Test
    fun `deve buscar parceiro por nome com sanitizacao SQL`() = runBlocking {
        val jsonResponseBody = createDbExplorerResponseBody(
            fields = listOf("CODPARC", "NOMEPARC", "RAZAOSOCIAL"),
            rows = listOf(
                listOf("200", "JOAO DA SILVA", "JOAO DA SILVA ME")
            )
        )
        val mockResponse = SankhyaGenericResponse(status = "1", responseBody = jsonResponseBody)
        val mockClient = MockSankhyaClient(mockResponse)
        val service = LookupService(mockClient)

        val resultado = service.buscarParceiros("https://teste.stoky.com.br", "session-123", "Joao ' Silva")

        assertEquals(1, resultado.size)
        assertTrue(mockClient.lastSqlExecuted!!.contains("JOAO '' SILVA"))
    }

    @Test
    fun `deve retornar lista vazia de parceiros se termo for nulo ou em branco`() = runBlocking {
        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "1"))
        val service = LookupService(mockClient)

        val resultado = service.buscarParceiros("https://teste.stoky.com.br", "session-123", "   ")

        assertTrue(resultado.isEmpty())
    }

    @Test
    fun `deve buscar produtos por descricao com sucesso`() = runBlocking {
        val jsonResponseBody = createDbExplorerResponseBody(
            fields = listOf("CODPROD", "DESCRPROD", "MARCA"),
            rows = listOf(
                listOf("5001", "PARAFUSO SEXTAVADO", "STOKY FIX")
            )
        )
        val mockResponse = SankhyaGenericResponse(status = "1", responseBody = jsonResponseBody)
        val mockClient = MockSankhyaClient(mockResponse)
        val service = LookupService(mockClient)

        val resultado = service.buscarProdutos("https://teste.stoky.com.br", "session-123", "parafuso")

        assertEquals(1, resultado.size)
        assertEquals("5001", resultado[0].id)
        assertEquals("PARAFUSO SEXTAVADO", resultado[0].title)
        assertEquals("STOKY FIX", resultado[0].subtitle)
    }
}
