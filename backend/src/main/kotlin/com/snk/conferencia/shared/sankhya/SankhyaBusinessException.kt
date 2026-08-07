package com.snk.conferencia.shared.sankhya

class SankhyaBusinessException(
    override val message: String,
    val statusCode: String = "0"
) : RuntimeException(message)
