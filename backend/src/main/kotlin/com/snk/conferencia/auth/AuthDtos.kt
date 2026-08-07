package com.snk.conferencia.auth

import kotlinx.serialization.Serializable

@Serializable
data class AuthCredentialsDto(
    val username: String,
    val password: String,
    val server: String // "producao" ou "treinamento"
)

@Serializable
data class TokenResponseDto(
    val token: String,
    val tokenType: String = "Bearer",
    val expiresIn: Long,
    val user: UserSessionDto
)

@Serializable
data class UserSessionDto(
    val idusu: String,
    val username: String,
    val jsessionid: String,
    val server: String
)

@Serializable
data class ErrorResponseDto(
    val title: String,
    val message: String,
    val status: Int
)

@Serializable
data class SankhyaLoginRequestBody(
    val serviceName: String = "MobileLoginSP.login",
    val requestBody: SankhyaLoginParams
)

@Serializable
data class SankhyaLoginParams(
    val NOMUSU: Map<String, String>,
    val INTERNO: Map<String, String>,
    val KEEPCONNECTED: Map<String, String> = mapOf("$" to "S")
)

@Serializable
data class SankhyaLoginResponseDto(
    val status: String? = null,
    val statusMessage: String? = null,
    val responseBody: SankhyaResponseBodyDto? = null
)

@Serializable
data class SankhyaResponseBodyDto(
    val jsessionid: SankhyaValueStringDto? = null,
    val idusu: SankhyaValueStringDto? = null,
    val ksessionid: SankhyaValueStringDto? = null
)

@Serializable
data class SankhyaValueStringDto(
    val `$`: String? = null
)
