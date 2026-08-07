package com.snk.conferencia.features.conferencia

import kotlinx.serialization.Serializable

@Serializable
data class EnviarDocaRequest(
    val nroConferencia: Long,
    val nroNota: Long,
    val ordemCarga: Long? = null
)

@Serializable
data class CancelarConferenciaRequest(
    val nroConferencia: Long,
    val codSit: Int? = null
)

@Serializable
data class ImprimirVolumesRequest(
    val nroUnico: Long,
    val nroSeparacao: Long
)

@Serializable
data class ConferenciaActionResponse(
    val status: String = "1",
    val mensagem: String
)
