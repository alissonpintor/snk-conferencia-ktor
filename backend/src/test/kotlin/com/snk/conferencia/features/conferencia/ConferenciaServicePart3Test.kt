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

class ConferenciaServicePart3Test {

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
    fun `deve finalizar conferencia com sucesso`() = runBlocking {
        val jsonLinha = buildJsonObject {
            put("DIVERGENCIA", JsonPrimitive("false"))
        }
        val jsonBody = buildJsonObject {
            putJsonObject("entity") {
                putJsonObject("linhas") {
                    put("linha", jsonLinha)
                }
            }
        }

        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "1", statusMessage = "Sucesso", responseBody = jsonBody))
        val service = ConferenciaService(mockClient)

        val resultado = service.finalizarConferencia("https://teste", "session-1", "15", FinalizarConferenciaRequest(nroConferencia = 979160L))

        assertEquals("1", resultado.status)
        assertEquals(979160L, resultado.nroConferencia)
        assertEquals("MgeWmsSP.produtosConferidos", mockClient.lastServiceNameCalled)
    }

    @Test
    fun `deve lancar SankhyaBusinessException ao finalizar conferencia com divergencia`() = runBlocking {
        val jsonLinha = buildJsonObject {
            put("DIVERGENCIA", JsonPrimitive("true"))
        }
        val jsonBody = buildJsonObject {
            putJsonObject("entity") {
                putJsonObject("linhas") {
                    put("linha", jsonLinha)
                }
            }
        }

        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "1", statusMessage = "Houve divergência no processo de conferência.", responseBody = jsonBody))
        val service = ConferenciaService(mockClient)

        val ex = assertFailsWith<SankhyaBusinessException> {
            runBlocking {
                service.finalizarConferencia("https://teste", "session-1", "15", FinalizarConferenciaRequest(nroConferencia = 979160L))
            }
        }

        assertEquals("Houve divergência no processo de conferência.", ex.message)
    }

    @Test
    fun `deve registrar volumes com sucesso`() = runBlocking {
        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "1", statusMessage = "Volumes registrados"))
        val service = ConferenciaService(mockClient)

        val resultado = service.registrarVolumes("https://teste", "session-1", "15", RegistrarVolumesRequest(nroConferencia = 979160L, quantidade = 3))

        assertEquals("1", resultado.status)
        assertEquals("MgeWmsSP.registraEtiquetasVolume", mockClient.lastServiceNameCalled)
    }

    @Test
    fun `deve lancar IllegalArgumentException em registrarVolumes com parametros invalidos`() = runBlocking {
        val mockClient = MockSankhyaClient(SankhyaGenericResponse(status = "1"))
        val service = ConferenciaService(mockClient)

        assertFailsWith<IllegalArgumentException> {
            runBlocking {
                service.registrarVolumes("https://teste", "session-1", "15", RegistrarVolumesRequest(nroConferencia = 0L, quantidade = 3))
            }
        }

        assertFailsWith<IllegalArgumentException> {
            runBlocking {
                service.registrarVolumes("https://teste", "session-1", "15", RegistrarVolumesRequest(nroConferencia = 979160L, quantidade = 0))
            }
        }
    }

    @Test
    fun `deve enviar conferencia para a doca com sucesso chamando liberaCheckoutDoca`() = runBlocking {
        val mockResponse = SankhyaGenericResponse(status = "1", statusMessage = "Sucesso")
        val mockClient = MockSankhyaClient(mockResponse)
        val service = ConferenciaService(mockClient)

        val request = EnviarDocaRequest(nroConferencia = 4001L, nroNota = 3001L, ordemCarga = 88L)
        val resultado = service.enviarParaDoca("https://teste.stoky.com.br", "session-123", "15", request)

        assertEquals("1", resultado.status)
        assertEquals("MgeWmsSP.liberaCheckoutDoca", mockClient.lastServiceNameCalled)
    }

    @Test
    fun `deve cancelar conferencia com sucesso chamando cancelaTarefa`() = runBlocking {
        val mockResponse = SankhyaGenericResponse(status = "1", statusMessage = "Cancelada")
        val mockClient = MockSankhyaClient(mockResponse)
        val service = ConferenciaService(mockClient)

        val request = CancelarConferenciaRequest(nroConferencia = 4001L, codSit = 3)
        val resultado = service.cancelarConferencia("https://teste.stoky.com.br", "session-123", "15", request)

        assertEquals("1", resultado.status)
        assertEquals("MgeWmsSP.cancelaTarefa", mockClient.lastServiceNameCalled)
    }

    @Test
    fun `deve imprimir volumes retornando documento HTML de etiquetas`() = runBlocking {
        val jsonResponseBody = buildJsonObject {
            put("fieldsMetadata", buildJsonArray {
                add(buildJsonObject { put("name", "IDREV") })
                add(buildJsonObject { put("name", "SEQETIQUETA") })
                add(buildJsonObject { put("name", "DHINC") })
            })
            put("rows", buildJsonArray {
                add(buildJsonArray {
                    add(JsonPrimitive("REV123"))
                    add(JsonPrimitive("1"))
                    add(JsonPrimitive("2026-08-07 10:00:00"))
                })
            })
        }
        val mockResponse = SankhyaGenericResponse(status = "1", responseBody = jsonResponseBody)
        val mockClient = MockSankhyaClient(mockResponse)
        val service = ConferenciaService(mockClient)

        val request = ImprimirVolumesRequest(nroUnico = 2001L, nroSeparacao = 1001L)
        val htmlResult = service.imprimirVolumes("https://teste.stoky.com.br", "session-123", request)

        assertTrue(htmlResult.contains("REV123"))
        assertTrue(htmlResult.contains("<!DOCTYPE html>"))
        assertTrue(mockClient.lastSqlExecuted!!.contains("TGWREV WHERE NUSEPARACAO = 1001"))
    }
}
