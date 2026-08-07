package com.snk.conferencia.features.conferencia

import com.snk.conferencia.shared.sankhya.SankhyaBusinessException
import com.snk.conferencia.shared.sankhya.SankhyaClientInterface
import com.snk.conferencia.shared.sankhya.SankhyaGenericResponse
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.buildJsonArray
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertTrue

class ConferenciaServicePart2Test {

    private class MockSankhyaClient(
        private val mockResponse: SankhyaGenericResponse
    ) : SankhyaClientInterface {
        var lastServiceNameCalled: String? = null
        var lastSqlExecuted: String? = null

        override suspend fun callService(
            baseUrl: String,
            serviceName: String,
            jsessionid: String,
            requestBody: kotlinx.serialization.json.JsonObject
        ): SankhyaGenericResponse {
            lastServiceNameCalled = serviceName
            if (mockResponse.status != "1") {
                throw SankhyaBusinessException(mockResponse.statusMessage ?: "Erro no serviço ERP", mockResponse.status ?: "0")
            }
            return mockResponse
        }

        override suspend fun executeQuery(
            baseUrl: String,
            jsessionid: String,
            sql: String
        ): SankhyaGenericResponse {
            lastSqlExecuted = sql
            if (mockResponse.status != "1") {
                throw SankhyaBusinessException(mockResponse.statusMessage ?: "Erro na consulta SQL", mockResponse.status ?: "0")
            }
            return mockResponse
        }

        override suspend fun saveRecord(
            baseUrl: String,
            jsessionid: String,
            entityName: String,
            fields: kotlinx.serialization.json.JsonObject
        ): SankhyaGenericResponse {
            if (mockResponse.status != "1") {
                throw SankhyaBusinessException(mockResponse.statusMessage ?: "Erro ao salvar registro", mockResponse.status ?: "0")
            }
            return mockResponse
        }
    }

    @Test
    fun `deve registrar item conferido com sucesso`() = runBlocking {
        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "1", statusMessage = "Item conferido com sucesso"))
        val service = ConferenciaService(mockClient)

        val req = RegistrarItemConferidoRequest(
            nroConferencia = 979160L,
            codBarra = "7891234567890",
            quantidade = 2.0
        )

        val resultado = service.registrarItemConferido("https://teste", "session-1", "15", req)

        assertEquals("1", resultado.status)
        assertEquals("MgeWmsSP.insereItemConferidoColetor", mockClient.lastServiceNameCalled)
    }

    @Test
    fun `deve lancar IllegalArgumentException em registrarItemConferido com parametros invalidos`() = runBlocking {
        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "1"))
        val service = ConferenciaService(mockClient)

        assertFailsWith<IllegalArgumentException> {
            runBlocking {
                service.registrarItemConferido("https://teste", "session-1", "15", RegistrarItemConferidoRequest(0L, "789", 1.0))
            }
        }

        assertFailsWith<IllegalArgumentException> {
            runBlocking {
                service.registrarItemConferido("https://teste", "session-1", "15", RegistrarItemConferidoRequest(979160L, "", 1.0))
            }
        }

        assertFailsWith<IllegalArgumentException> {
            runBlocking {
                service.registrarItemConferido("https://teste", "session-1", "15", RegistrarItemConferidoRequest(979160L, "789", 0.0))
            }
        }
    }

    @Test
    fun `deve atualizar saldo de item com sucesso`() = runBlocking {
        val jsonBody = buildJsonObject {
            put("fieldsMetadata", buildJsonArray {
                add(buildJsonObject { put("name", "CODPROD") })
                add(buildJsonObject { put("name", "QTCONFERIDA") })
                add(buildJsonObject { put("name", "QTDAVARIA") })
                add(buildJsonObject { put("name", "SEQQUENCIA") })
            })
            put("rows", buildJsonArray {
                add(buildJsonArray {
                    add(JsonPrimitive("1001"))
                    add(JsonPrimitive("8.0"))
                    add(JsonPrimitive("0.0"))
                    add(JsonPrimitive("10,11,12"))
                })
            })
        }

        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "1", responseBody = jsonBody))
        val service = ConferenciaService(mockClient)

        val resultado = service.atualizarSaldoItem("https://teste", "session-1", AtualizarSaldoRequest(nroConferencia = 979160L, codProduto = 1001L))

        assertEquals(1, resultado.size)
        assertEquals(1001L, resultado[0].codProduto)
        assertEquals(8.0, resultado[0].qtdadeConferida)
        assertEquals(listOf(10L, 11L, 12L), resultado[0].sequencias)
        assertTrue(mockClient.lastSqlExecuted!!.contains("APP_CONFERENCIA_ITENS_SALDO"))
    }

    @Test
    fun `deve lancar IllegalArgumentException em atualizarSaldoItem se nroConferencia for invalido`() = runBlocking {
        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "1"))
        val service = ConferenciaService(mockClient)

        assertFailsWith<IllegalArgumentException> {
            runBlocking {
                service.atualizarSaldoItem("https://teste", "session-1", AtualizarSaldoRequest(nroConferencia = 0L))
            }
        }
    }

    @Test
    fun `deve remover itens da conferencia com sucesso`() = runBlocking {
        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "1", statusMessage = "Itens removidos com sucesso"))
        val service = ConferenciaService(mockClient)

        val req = RemoverItensRequest(nroConferencia = 979160L, sequencias = listOf(10L, 11L))
        val resultado = service.removerItens("https://teste", "session-1", "15", req)

        assertEquals("1", resultado.status)
        assertEquals("MgeWmsSP.removeItensConferidosColetor", mockClient.lastServiceNameCalled)
    }

    @Test
    fun `deve lancar IllegalArgumentException em removerItens se nroConferencia for invalido`() = runBlocking {
        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "1"))
        val service = ConferenciaService(mockClient)

        assertFailsWith<IllegalArgumentException> {
            runBlocking {
                service.removerItens("https://teste", "session-1", "15", RemoverItensRequest(nroConferencia = 0L))
            }
        }
    }

    @Test
    fun `deve lancar SankhyaBusinessException quando bipagem falhar no ERP`() = runBlocking {
        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "0", statusMessage = "Codigo de barras nao pertence ao pedido"))
        val service = ConferenciaService(mockClient)

        val ex = assertFailsWith<SankhyaBusinessException> {
            runBlocking {
                service.registrarItemConferido("https://teste", "session-1", "15", RegistrarItemConferidoRequest(979160L, "999999999", 1.0))
            }
        }

        assertEquals("Codigo de barras nao pertence ao pedido", ex.message)
    }
}
