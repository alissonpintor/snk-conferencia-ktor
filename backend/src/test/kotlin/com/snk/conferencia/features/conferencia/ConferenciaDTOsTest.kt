package com.snk.conferencia.features.conferencia

import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlin.test.Test
import kotlin.test.assertEquals

class ConferenciaDTOsTest {

    private val json = Json {
        prettyPrint = true
        ignoreUnknownKeys = true
    }

    @Test
    fun `deve serializar e desserializar BuscarConferenciaRequest`() {
        val dto = BuscarConferenciaRequest(checkout = "02.904.258", nroConferencia = 979160L)
        val jsonString = json.encodeToString(dto)
        val decoded = json.decodeFromString<BuscarConferenciaRequest>(jsonString)

        assertEquals("02.904.258", decoded.checkout)
        assertEquals(979160L, decoded.nroConferencia)
    }

    @Test
    fun `deve serializar e desserializar ConferenciaResponse`() {
        val dto = ConferenciaResponse(
            nroConferencia = 979160L,
            nroSeparacao = 902695L,
            nroUnico = 1739978L,
            nroNota = 316438L,
            ordemCarga = 13573L,
            checkout = "02.904.258",
            codDoca = 72135L,
            descrDoca = "DOCA EXPEDIÇÃO 110"
        )
        val jsonString = json.encodeToString(dto)
        val decoded = json.decodeFromString<ConferenciaResponse>(jsonString)

        assertEquals(979160L, decoded.nroConferencia)
        assertEquals(902695L, decoded.nroSeparacao)
        assertEquals("DOCA EXPEDIÇÃO 110", decoded.descrDoca)
    }

    @Test
    fun `deve serializar e desserializar IniciarConferenciaRequest e Response`() {
        val req = IniciarConferenciaRequest(checkout = "02.904.258")
        val reqDecoded = json.decodeFromString<IniciarConferenciaRequest>(json.encodeToString(req))
        assertEquals("02.904.258", reqDecoded.checkout)

        val resp = IniciarConferenciaResponse(
            nroConferencia = 979160L,
            tipoConferencia = "E",
            sepAgrupada = "N",
            volumeContinuo = "N",
            impEtiquetaFechVol = "S"
        )
        val respDecoded = json.decodeFromString<IniciarConferenciaResponse>(json.encodeToString(resp))
        assertEquals(979160L, respDecoded.nroConferencia)
        assertEquals("E", respDecoded.tipoConferencia)
    }

    @Test
    fun `deve serializar e desserializar ConferenciaPendenteResponse`() {
        val dto = ConferenciaPendenteResponse(nroConferencia = 979160L, checkout = "02.904.258", nroSeparacao = 902695L)
        val jsonString = json.encodeToString(dto)
        val decoded = json.decodeFromString<ConferenciaPendenteResponse>(jsonString)

        assertEquals(979160L, decoded.nroConferencia)
        assertEquals("02.904.258", decoded.checkout)
        assertEquals(902695L, decoded.nroSeparacao)
    }

    @Test
    fun `deve serializar e desserializar ItemConferenciaResponse`() {
        val dto = ItemConferenciaResponse(
            codProduto = 1001L,
            descrProduto = "PRODUTO TESTE DE CONFERÊNCIA",
            codBarra = "7891234567890",
            quantidade = 10.0,
            qtdadeConferida = 5.0,
            qtdadeAvariada = 0.0,
            sequencias = listOf(1L, 2L, 3L),
            possuiDivergencia = false
        )
        val jsonString = json.encodeToString(dto)
        val decoded = json.decodeFromString<ItemConferenciaResponse>(jsonString)

        assertEquals(1001L, decoded.codProduto)
        assertEquals(10.0, decoded.quantidade)
        assertEquals(3, decoded.sequencias.size)
    }

    @Test
    fun `deve serializar e desserializar InfoProdutoRequest e Response`() {
        val req = InfoProdutoRequest(nroConferencia = 979160L, codBarra = "7891234567890", quantidade = 2.0)
        val reqDecoded = json.decodeFromString<InfoProdutoRequest>(json.encodeToString(req))
        assertEquals(979160L, reqDecoded.nroConferencia)

        val resp = InfoProdutoResponse(codProduto = 1001L, descrProduto = "SHAMPOO 200ML", complemento = "EMBALAGEM CAIXA", pesoBruto = 0.5)
        val respDecoded = json.decodeFromString<InfoProdutoResponse>(json.encodeToString(resp))
        assertEquals(1001L, respDecoded.codProduto)
        assertEquals("SHAMPOO 200ML", respDecoded.descrProduto)
    }

    @Test
    fun `deve serializar e desserializar RegistrarItemConferidoRequest e Response`() {
        val req = RegistrarItemConferidoRequest(
            nroConferencia = 979160L,
            codBarra = "7891234567890",
            quantidade = 1.0,
            qtdadeAvariada = 0.0,
            nroVolume = 1,
            codCaixa = "CX01",
            modoEdicao = "N",
            volumeContinuo = "N"
        )
        val reqDecoded = json.decodeFromString<RegistrarItemConferidoRequest>(json.encodeToString(req))
        assertEquals("7891234567890", reqDecoded.codBarra)

        val resp = RegistrarItemResponse(status = "OK", mensagem = "Item registrado com sucesso")
        val respDecoded = json.decodeFromString<RegistrarItemResponse>(json.encodeToString(resp))
        assertEquals("OK", respDecoded.status)
    }

    @Test
    fun `deve serializar e desserializar AtualizarSaldoRequest`() {
        val req = AtualizarSaldoRequest(nroConferencia = 979160L, codBarra = "7891234567890", codProduto = 1001L)
        val decoded = json.decodeFromString<AtualizarSaldoRequest>(json.encodeToString(req))

        assertEquals(979160L, decoded.nroConferencia)
        assertEquals("7891234567890", decoded.codBarra)
        assertEquals(1001L, decoded.codProduto)
    }

    @Test
    fun `deve serializar e desserializar SaldoItemResponse`() {
        val dto = SaldoItemResponse(
            codProduto = 1001L,
            qtdadeConferida = 8.0,
            sequencias = listOf(10L, 11L),
            qtdadeAvariada = 0.0,
            possuiDivergencia = false
        )
        val jsonString = json.encodeToString(dto)
        val decoded = json.decodeFromString<SaldoItemResponse>(jsonString)

        assertEquals(8.0, decoded.qtdadeConferida)
        assertEquals(2, decoded.sequencias.size)
    }

    @Test
    fun `deve serializar e desserializar RemoverItensRequest`() {
        val req = RemoverItensRequest(nroConferencia = 979160L, sequencias = listOf(1L, 2L))
        val decoded = json.decodeFromString<RemoverItensRequest>(json.encodeToString(req))

        assertEquals(979160L, decoded.nroConferencia)
        assertEquals(2, decoded.sequencias?.size)
    }

    @Test
    fun `deve serializar e desserializar FinalizarConferenciaRequest e Response`() {
        val finReq = FinalizarConferenciaRequest(nroConferencia = 979160L)
        val finResp = FinalizarConferenciaResponse(nroConferencia = 979160L, status = "1", mensagem = "Conferência encerrada")

        assertEquals(979160L, json.decodeFromString<FinalizarConferenciaRequest>(json.encodeToString(finReq)).nroConferencia)
        assertEquals("1", json.decodeFromString<FinalizarConferenciaResponse>(json.encodeToString(finResp)).status)
    }

    @Test
    fun `deve serializar e desserializar RegistrarVolumesRequest`() {
        val volReq = RegistrarVolumesRequest(nroConferencia = 979160L, quantidade = 4)
        val decoded = json.decodeFromString<RegistrarVolumesRequest>(json.encodeToString(volReq))

        assertEquals(979160L, decoded.nroConferencia)
        assertEquals(4, decoded.quantidade)
    }

    @Test
    fun `deve serializar e desserializar ImprimirVolumesRequest`() {
        val req = ImprimirVolumesRequest(nroUnico = 1739978L, nroSeparacao = 902695L, quantidade = 2)
        val decoded = json.decodeFromString<ImprimirVolumesRequest>(json.encodeToString(req))

        assertEquals(1739978L, decoded.nroUnico)
        assertEquals(902695L, decoded.nroSeparacao)
        assertEquals(2, decoded.quantidade)
    }

    @Test
    fun `deve serializar e desserializar EnviarDocaRequest`() {
        val req = EnviarDocaRequest(nroConferencia = 979160L, nroNota = 316438L, ordemCarga = 13573L)
        val decoded = json.decodeFromString<EnviarDocaRequest>(json.encodeToString(req))

        assertEquals(979160L, decoded.nroConferencia)
        assertEquals(316438L, decoded.nroNota)
        assertEquals(13573L, decoded.ordemCarga)
    }

    @Test
    fun `deve serializar e desserializar CancelarConferenciaRequest`() {
        val req = CancelarConferenciaRequest(nroConferencia = 979160L, codSit = 3)
        val decoded = json.decodeFromString<CancelarConferenciaRequest>(json.encodeToString(req))

        assertEquals(979160L, decoded.nroConferencia)
        assertEquals(3, decoded.codSit)
    }

    @Test
    fun `deve serializar e desserializar ConferenciaActionResponse`() {
        val resp = ConferenciaActionResponse(status = "1", mensagem = "Ação concluída")
        val decoded = json.decodeFromString<ConferenciaActionResponse>(json.encodeToString(resp))

        assertEquals("1", decoded.status)
        assertEquals("Ação concluída", decoded.mensagem)
    }
}
