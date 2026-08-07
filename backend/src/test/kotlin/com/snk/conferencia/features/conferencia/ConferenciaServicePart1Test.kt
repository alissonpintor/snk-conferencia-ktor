package com.snk.conferencia.features.conferencia

import com.snk.conferencia.shared.sankhya.SankhyaBusinessException
import com.snk.conferencia.shared.sankhya.SankhyaClientInterface
import com.snk.conferencia.shared.sankhya.SankhyaGenericResponse
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.buildJsonArray
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put
import kotlinx.serialization.json.putJsonObject
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertTrue

class ConferenciaServicePart1Test {

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
    fun `deve buscar conferencia por checkout formatando mascara`() = runBlocking {
        val jsonBody = buildJsonObject {
            put("fieldsMetadata", buildJsonArray {
                add(buildJsonObject { put("name", "NUCONFERENCIA") })
                add(buildJsonObject { put("name", "NUSEPARACAO") })
                add(buildJsonObject { put("name", "NUNOTA") })
                add(buildJsonObject { put("name", "NUMNOTA") })
                add(buildJsonObject { put("name", "ENDERECO") })
            })
            put("rows", buildJsonArray {
                add(buildJsonArray {
                    add(JsonPrimitive("979160"))
                    add(JsonPrimitive("902695"))
                    add(JsonPrimitive("1739978"))
                    add(JsonPrimitive("316438"))
                    add(JsonPrimitive("02.904.258"))
                })
            })
        }

        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "1", responseBody = jsonBody))
        val service = ConferenciaService(mockClient)

        val resultado = service.buscarConferencia("https://teste", "session-1", BuscarConferenciaRequest(checkout = "02904258"))

        assertEquals(1, resultado.size)
        assertEquals(979160L, resultado[0].nroConferencia)
        assertTrue(mockClient.lastSqlExecuted!!.contains("'02.904.258' IN ENDERECO"))
    }

    @Test
    fun `deve lancar IllegalArgumentException se nenhum filtro for informado na busca`() = runBlocking {
        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "1"))
        val service = ConferenciaService(mockClient)

        assertFailsWith<IllegalArgumentException> {
            runBlocking {
                service.buscarConferencia("https://teste", "session-1", BuscarConferenciaRequest())
            }
        }
    }

    @Test
    fun `deve iniciar conferencia com sucesso`() = runBlocking {
        val jsonLinha = buildJsonObject {
            put("NUCONFERENCIA", JsonPrimitive("979160"))
            put("TIPCONF", JsonPrimitive("E"))
            put("VOLCONTINUO", JsonPrimitive("N"))
            put("IMPETIQFECHVOL", JsonPrimitive("S"))
        }
        val jsonBody = buildJsonObject {
            putJsonObject("entity") {
                putJsonObject("linhas") {
                    put("linha", jsonLinha)
                }
            }
        }

        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "1", responseBody = jsonBody))
        val service = ConferenciaService(mockClient)

        val resultado = service.iniciarConferencia("https://teste", "session-1", "15", IniciarConferenciaRequest(checkout = "02.904.258"))

        assertEquals(1, resultado.size)
        assertEquals(979160L, resultado[0].nroConferencia)
        assertEquals("MgeWmsSP.buscaConferenciaPorPedido", mockClient.lastServiceNameCalled)
    }

    @Test
    fun `deve lancar IllegalArgumentException ao iniciar conferencia sem checkout`() = runBlocking {
        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "1"))
        val service = ConferenciaService(mockClient)

        assertFailsWith<IllegalArgumentException> {
            runBlocking {
                service.iniciarConferencia("https://teste", "session-1", "15", IniciarConferenciaRequest(checkout = ""))
            }
        }
    }

    @Test
    fun `deve buscar tarefas pendentes com sucesso`() = runBlocking {
        val jsonBody = buildJsonObject {
            put("fieldsMetadata", buildJsonArray {
                add(buildJsonObject { put("name", "NUCONFERENCIA") })
                add(buildJsonObject { put("name", "ENDERECO") })
                add(buildJsonObject { put("name", "NUSEPARACAO") })
            })
            put("rows", buildJsonArray {
                add(buildJsonArray {
                    add(JsonPrimitive("979160"))
                    add(JsonPrimitive("02.904.258"))
                    add(JsonPrimitive("902695"))
                })
            })
        }

        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "1", responseBody = jsonBody))
        val service = ConferenciaService(mockClient)

        val resultado = service.buscarTarefasPendentes("https://teste", "session-1", "15")

        assertEquals(1, resultado.size)
        assertEquals(979160L, resultado[0].nroConferencia)
        assertTrue(mockClient.lastSqlExecuted!!.contains("COD_SITUACAO = 4 AND CODUSU = 15"))
    }

    @Test
    fun `deve lancar IllegalArgumentException se userId for invalido em buscarTarefasPendentes`() = runBlocking {
        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "1"))
        val service = ConferenciaService(mockClient)

        assertFailsWith<IllegalArgumentException> {
            runBlocking {
                service.buscarTarefasPendentes("https://teste", "session-1", "")
            }
        }
    }

    @Test
    fun `deve buscar itens da conferencia com sucesso`() = runBlocking {
        val jsonBody = buildJsonObject {
            put("fieldsMetadata", buildJsonArray {
                add(buildJsonObject { put("name", "CODPROD") })
                add(buildJsonObject { put("name", "DESCRPROD") })
                add(buildJsonObject { put("name", "CODBARRA") })
                add(buildJsonObject { put("name", "QTDNEG") })
                add(buildJsonObject { put("name", "QTDCONFERIDA") })
                add(buildJsonObject { put("name", "QTDAVARIA") })
            })
            put("rows", buildJsonArray {
                add(buildJsonArray {
                    add(JsonPrimitive("1001"))
                    add(JsonPrimitive("SHAMPOO 200ML"))
                    add(JsonPrimitive("7891234567890"))
                    add(JsonPrimitive("10.0"))
                    add(JsonPrimitive("5.0"))
                    add(JsonPrimitive("0.0"))
                })
            })
        }

        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "1", responseBody = jsonBody))
        val service = ConferenciaService(mockClient)

        val resultado = service.buscarItensConferencia("https://teste", "session-1", 979160L)

        assertEquals(1, resultado.size)
        assertEquals(1001L, resultado[0].codProduto)
        assertEquals(10.0, resultado[0].quantidade)
        assertEquals(5.0, resultado[0].qtdadeConferida)
    }

    @Test
    fun `deve lancar IllegalArgumentException se nroConferencia for invalido em buscarItensConferencia`() = runBlocking {
        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "1"))
        val service = ConferenciaService(mockClient)

        assertFailsWith<IllegalArgumentException> {
            runBlocking {
                service.buscarItensConferencia("https://teste", "session-1", 0L)
            }
        }
    }

    @Test
    fun `deve obter info do produto com sucesso`() = runBlocking {
        val jsonLinha = buildJsonObject {
            put("CODPROD", JsonPrimitive("1001"))
            put("DESCRPROD", JsonPrimitive("SHAMPOO 200ML"))
            put("COMPLEMENTO", JsonPrimitive("CX COM 12"))
            put("PESOBRUTO", JsonPrimitive("0.25"))
        }
        val jsonBody = buildJsonObject {
            putJsonObject("entity") {
                putJsonObject("linhas") {
                    put("linha", jsonLinha)
                }
            }
        }

        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "1", responseBody = jsonBody))
        val service = ConferenciaService(mockClient)

        val resultado = service.obterInfoProduto("https://teste", "session-1", "15", InfoProdutoRequest(979160L, "7891234567890", 1.0))

        assertEquals(1001L, resultado.codProduto)
        assertEquals("SHAMPOO 200ML", resultado.descrProduto)
        assertEquals("CX COM 12", resultado.complemento)
    }

    @Test
    fun `deve lancar IllegalArgumentException se dados forem invalidos em obterInfoProduto`() = runBlocking {
        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "1"))
        val service = ConferenciaService(mockClient)

        assertFailsWith<IllegalArgumentException> {
            runBlocking {
                service.obterInfoProduto("https://teste", "session-1", "15", InfoProdutoRequest(0L, "7891234567890", 1.0))
            }
        }

        assertFailsWith<IllegalArgumentException> {
            runBlocking {
                service.obterInfoProduto("https://teste", "session-1", "15", InfoProdutoRequest(979160L, "", 1.0))
            }
        }
    }

    @Test
    fun `deve lancar SankhyaBusinessException quando ERP retornar erro`() = runBlocking {
        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "0", statusMessage = "Checkout ocupado por outro usuario"))
        val service = ConferenciaService(mockClient)

        val ex = assertFailsWith<SankhyaBusinessException> {
            runBlocking {
                service.iniciarConferencia("https://teste", "session-1", "15", IniciarConferenciaRequest(checkout = "02.904.258"))
            }
        }

        assertEquals("Checkout ocupado por outro usuario", ex.message)
    }
}
