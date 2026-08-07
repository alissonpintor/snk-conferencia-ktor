package com.snk.conferencia.shared.sankhya

import com.snk.conferencia.auth.JwtProvider
import com.snk.conferencia.plugins.AuthenticationException
import io.ktor.server.application.*
import io.ktor.server.request.*

data class SankhyaSessionContext(
    val jsessionid: String,
    val baseUrl: String,
    val userId: String = "0"
)

fun ApplicationCall.extractSankhyaSession(jwtProvider: JwtProvider? = null): SankhyaSessionContext {
    val authHeader = request.headers["Authorization"]
    if (!authHeader.isNullOrBlank() && authHeader.startsWith("Bearer ", ignoreCase = true)) {
        val token = authHeader.substring(7).trim()
        if (token.isNotBlank() && jwtProvider != null) {
            val session = jwtProvider.verifyToken(token)
            val defaultUrl = if (session.server.equals("treinamento", ignoreCase = true)) {
                "https://teste.stoky.com.br"
            } else {
                "https://sankhya.stoky.com.br"
            }
            return SankhyaSessionContext(
                jsessionid = session.jsessionid,
                baseUrl = request.headers["X-Sankhya-Url"] ?: defaultUrl,
                userId = session.idusu
            )
        }
    }

    val jsessionid = request.cookies["JSESSIONID"]
        ?: request.headers["JSESSIONID"]
        ?: request.headers["mgeSession"]
        ?: ""

    if (jsessionid.isBlank()) {
        throw AuthenticationException("Sessão não informada. Informe o token Bearer no cabeçalho Authorization ou o header JSESSIONID.")
    }

    val baseUrl = request.headers["X-Sankhya-Url"] ?: "https://sankhya.stoky.com.br"
    val userId = request.headers["X-User-Id"] ?: "0"

    return SankhyaSessionContext(
        jsessionid = jsessionid,
        baseUrl = baseUrl,
        userId = userId
    )
}
