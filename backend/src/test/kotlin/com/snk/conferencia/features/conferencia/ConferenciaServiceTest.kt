package com.snk.conferencia.features.conferencia

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

class ConferenciaServiceTest {

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

    @Test
    fun `deve enviar conferencia para a doca com sucesso`() = runBlocking {
        val mockResponse = SankhyaGenericResponse(status = "1", statusMessage = "Sucesso")
        val mockClient = MockSankhyaClient(mockResponse)
        val service = ConferenciaService(mockClient)

        val request = EnviarDocaRequest(
            nroConferencia = 4001L,
            nroNota = 3001L,
            ordemCarga = 88L
        )

        val resultado = service.enviarParaDoca("https://teste.stoky.com.br", "session-123", "15", request)

        assertEquals("1", resultado.status)
        assertEquals("MgeWmsSP.liberaCheckoutDoca", mockClient.lastServiceNameCalled)
    }

    @Test
    fun `deve lancar IllegalArgumentException se nroConferencia ou nroNota for invalido ao enviar para doca`() = runBlocking {
        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "1"))
        val service = ConferenciaService(mockClient)

        assertFailsWith<IllegalArgumentException> {
            runBlocking {
                service.enviarParaDoca("https://teste.stoky.com.br", "session-123", "15", EnviarDocaRequest(0, 3001L))
            }
        }

        assertFailsWith<IllegalArgumentException> {
            runBlocking {
                service.enviarParaDoca("https://teste.stoky.com.br", "session-123", "15", EnviarDocaRequest(4001L, 0))
            }
        }

        assertFailsWith<IllegalArgumentException> {
            runBlocking {
                service.enviarParaDoca("https://teste.stoky.com.br", "session-123", "15", EnviarDocaRequest(4001L, 3001L, ordemCarga = 0L))
            }
        }
    }

    @Test
    fun `deve cancelar conferencia com sucesso`() = runBlocking {
        val mockResponse = SankhyaGenericResponse(status = "1", statusMessage = "Cancelada")
        val mockClient = MockSankhyaClient(mockResponse)
        val service = ConferenciaService(mockClient)

        val request = CancelarConferenciaRequest(nroConferencia = 4001L, codSit = 3)

        val resultado = service.cancelarConferencia("https://teste.stoky.com.br", "session-123", "15", request)

        assertEquals("1", resultado.status)
        assertEquals("MgeWmsSP.cancelaTarefa", mockClient.lastServiceNameCalled)
    }

    @Test
    fun `deve lancar IllegalArgumentException se numero de conferencia for invalido ao cancelar`() = runBlocking {
        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "1"))
        val service = ConferenciaService(mockClient)

        assertFailsWith<IllegalArgumentException> {
            runBlocking {
                service.cancelarConferencia("https://teste.stoky.com.br", "session-123", "15", CancelarConferenciaRequest(0))
            }
        }
    }

    @Test
    fun `deve solicitar impressao de volumes com sucesso`() = runBlocking {
        val jsonResponseBody = buildJsonObject {
            put("fieldsMetadata", buildJsonArray {
                add(buildJsonObject { put("name", "IDREV") })
                add(buildJsonObject { put("name", "SEQETIQUETA") })
            })
            put("rows", buildJsonArray {
                add(buildJsonArray {
                    add(JsonPrimitive("REV123"))
                    add(JsonPrimitive("1"))
                })
            })
        }
        val mockResponse = SankhyaGenericResponse(status = "1", responseBody = jsonResponseBody)
        val mockClient = MockSankhyaClient(mockResponse)
        val service = ConferenciaService(mockClient)

        val request = ImprimirVolumesRequest(nroUnico = 2001L, nroSeparacao = 1001L)

        val resultado = service.imprimirVolumes("https://teste.stoky.com.br", "session-123", request)

        assertTrue(resultado.contains("REV123"))
        assertTrue(mockClient.lastSqlExecuted!!.contains("TGWREV WHERE NUSEPARACAO = 1001"))
    }

    @Test
    fun `deve lancar IllegalArgumentException se nroUnico ou nroSeparacao for invalido na impressao`() = runBlocking {
        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "1"))
        val service = ConferenciaService(mockClient)

        assertFailsWith<IllegalArgumentException> {
            runBlocking {
                service.imprimirVolumes("https://teste.stoky.com.br", "session-123", ImprimirVolumesRequest(0, 1001L))
            }
        }

        assertFailsWith<IllegalArgumentException> {
            runBlocking {
                service.imprimirVolumes("https://teste.stoky.com.br", "session-123", ImprimirVolumesRequest(2001L, 0))
            }
        }
    }
}
