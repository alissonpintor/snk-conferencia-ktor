package com.snk.conferencia.features.separacao

import com.snk.conferencia.shared.sankhya.SankhyaGenericResponse
import com.snk.conferencia.shared.sankhya.SankhyaClientInterface
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.buildJsonArray
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertTrue

class SeparacaoServiceTest {

    private class MockSankhyaClient(
        private val mockResponse: SankhyaGenericResponse
    ) : SankhyaClientInterface {
        var lastSqlExecuted: String? = null
        var lastServiceNameCalled: String? = null

        override suspend fun callService(
            baseUrl: String,
            serviceName: String,
            jsessionid: String,
            requestBody: kotlinx.serialization.json.JsonObject
        ): SankhyaGenericResponse {
            lastServiceNameCalled = serviceName
            return mockResponse
        }

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
    fun `deve buscar separacoes com filtros validos`() = runBlocking {
        val jsonResponseBody = createDbExplorerResponseBody(
            fields = listOf(
                "CODEMPOC", "NUSEPARACAO", "NROTAREFA", "NUNOTA", "NUMNOTA",
                "CODPARC", "NOMEPARC", "ORDEMCARGA", "DTSEPARACAO", "COD_SITUACAO",
                "SITUACAO", "NUCONFERENCIA", "ENVIADO_DOCA", "CODUSU", "NOMEUSU",
                "SEPARADOR", "CODAREASEP", "NOMEAREASEP", "ENDERECO", "TIPO_ENTREGA"
            ),
            rows = listOf(
                listOf(
                    "1", "1001", "500", "2001", "3001",
                    "10", "PARCEIRO TESTE", "88", "2026-08-01", "1",
                    "Pendente", "4001", "S", "15", "USUARIO CONF",
                    "SEPARADOR 1", "2", "AREA EXP", "CHECKOUT-01", "ENTREGA PADRAO"
                )
            )
        )
        val mockResponse = SankhyaGenericResponse(status = "1", responseBody = jsonResponseBody)
        val mockClient = MockSankhyaClient(mockResponse)
        val service = SeparacaoService(mockClient)

        val filtros = SeparacaoFilterRequest(
            empresa = 1,
            nroSeparacao = 1001,
            dataInicio = "2026-08-01"
        )

        val resultado = service.buscarSeparacoes("https://teste.stoky.com.br", "session-123", filtros)

        assertEquals(1, resultado.size)
        assertEquals(1L, resultado[0].codEmp)
        assertEquals(1001L, resultado[0].nroSeparacao)
        assertEquals("PARCEIRO TESTE", resultado[0].nomeParc)
        assertEquals("Sim", resultado[0].enviadoParaDoca)

        val sql = mockClient.lastSqlExecuted!!
        assertTrue(sql.contains("CODEMPOC = 1"))
        assertTrue(sql.contains("NUSEPARACAO = 1001"))
        assertTrue(sql.contains("DTSEPARACAO >= TO_DATE('2026-08-01', 'YYYY-MM-DD')"))
    }

    @Test
    fun `deve lancar IllegalArgumentException se nenhum filtro for fornecido`() = runBlocking {
        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "1"))
        val service = SeparacaoService(mockClient)

        assertFailsWith<IllegalArgumentException> {
            runBlocking {
                service.buscarSeparacoes("https://teste.stoky.com.br", "session-123", SeparacaoFilterRequest())
            }
        }
    }

    @Test
    fun `deve buscar itens de uma separacao`() = runBlocking {
        val jsonResponseBody = createDbExplorerResponseBody(
            fields = listOf(
                "NUSEPARACAO", "NUTAREFA", "CODPROD", "DESCRICAO", "MARCA",
                "REFERENCIA", "REFFORN", "UND", "QTD", "ENDORIG", "ENDDEST",
                "NOMEUSU", "SITUACAO", "DHINICIALEXEC", "DHFINALEXEC"
            ),
            rows = listOf(
                listOf(
                    "1001", "500", "7700", "PARAFUSO INOX", "STOKY",
                    "7891234567890", "REF-77", "UN", "10.0", "A-01", "B-02",
                    "USUARIO 1", "Concluído", "2026-08-01T10:00:00", "2026-08-01T10:15:00"
                )
            )
        )
        val mockResponse = SankhyaGenericResponse(status = "1", responseBody = jsonResponseBody)
        val mockClient = MockSankhyaClient(mockResponse)
        val service = SeparacaoService(mockClient)

        val resultado = service.buscarItens("https://teste.stoky.com.br", "session-123", 1001L)

        assertEquals(1, resultado.size)
        assertEquals(7700L, resultado[0].codProduto)
        assertEquals("PARAFUSO INOX", resultado[0].descricaoProduto)
        assertEquals(10.0, resultado[0].quantidade)
        assertTrue(mockClient.lastSqlExecuted!!.contains("NUSEPARACAO = 1001"))
    }

    @Test
    fun `deve obter quantidade de volumes de uma separacao`() = runBlocking {
        val jsonResponseBody = createDbExplorerResponseBody(
            fields = listOf("QTD"),
            rows = listOf(listOf("3"))
        )
        val mockResponse = SankhyaGenericResponse(status = "1", responseBody = jsonResponseBody)
        val mockClient = MockSankhyaClient(mockResponse)
        val service = SeparacaoService(mockClient)

        val resultado = service.obterQuantidadeVolumes("https://teste.stoky.com.br", "session-123", 1001L)

        assertEquals(1001L, resultado.nroSeparacao)
        assertEquals(3, resultado.quantidade)
        assertTrue(mockClient.lastSqlExecuted!!.contains("TGWREV WHERE NUSEPARACAO = 1001"))
    }

    @Test
    fun `deve gerar volumes para uma separacao com sucesso`() = runBlocking {
        val mockResponse = SankhyaGenericResponse(status = "1", statusMessage = "Sucesso")
        val mockClient = MockSankhyaClient(mockResponse)
        val service = SeparacaoService(mockClient)

        val request = GerarVolumesRequest(
            nroConferencia = 4001L,
            quantidadeAtual = 0,
            quantidade = 2
        )

        val resultado = service.gerarVolumes("https://teste.stoky.com.br", "session-123", 1001L, request)

        assertEquals(1001L, resultado.nroSeparacao)
        assertEquals("1", resultado.status)
        assertEquals("MgeWmsSP.gerarEtiquetasVolume", mockClient.lastServiceNameCalled)
    }

    @Test
    fun `deve lancar IllegalArgumentException se quantidade de volumes for zero ou negativa`() = runBlocking {
        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "1"))
        val service = SeparacaoService(mockClient)

        val request = GerarVolumesRequest(
            nroConferencia = 4001L,
            quantidadeAtual = 0,
            quantidade = 0
        )

        assertFailsWith<IllegalArgumentException> {
            runBlocking {
                service.gerarVolumes("https://teste.stoky.com.br", "session-123", 1001L, request)
            }
        }
    }
}
