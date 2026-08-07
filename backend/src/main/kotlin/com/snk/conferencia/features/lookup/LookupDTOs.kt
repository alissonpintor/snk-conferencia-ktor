package com.snk.conferencia.features.lookup

import kotlinx.serialization.Serializable

@Serializable
data class EmpresaResponse(
    val id: String,
    val title: String,
    val subtitle: String? = null
)

@Serializable
data class ParceiroResponse(
    val id: String,
    val title: String,
    val subtitle: String? = null
)

@Serializable
data class ProdutoResponse(
    val id: String,
    val title: String,
    val subtitle: String? = null
)
