package com.snk.conferencia.auth

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.JWTVerificationException
import com.snk.conferencia.plugins.AuthenticationException
import java.util.*

class JwtProvider(
    private val secret: String = "snk-conferencia-secret-key-production-min-256-bits-super-secure",
    private val issuer: String = "snk-conferencia",
    private val audience: String = "snk-conferencia-users",
    private val expirationMs: Long = 86_400_000L // 24 Horas
) {
    private val algorithm = Algorithm.HMAC256(secret)

    private val verifier = JWT.require(algorithm)
        .withIssuer(issuer)
        .withAudience(audience)
        .build()

    fun generateToken(userSession: UserSessionDto): String {
        val now = Date()
        val expiresAt = Date(now.time + expirationMs)

        return JWT.create()
            .withIssuer(issuer)
            .withAudience(audience)
            .withSubject(userSession.username)
            .withClaim("jsessionid", userSession.jsessionid)
            .withClaim("idusu", userSession.idusu)
            .withClaim("server", userSession.server)
            .withIssuedAt(now)
            .withExpiresAt(expiresAt)
            .sign(algorithm)
    }

    fun verifyToken(token: String): UserSessionDto {
        try {
            val jwt = verifier.verify(token)
            val username = jwt.subject ?: throw AuthenticationException("Token sem usuário identificado")
            val jsessionid = jwt.getClaim("jsessionid").asString()
                ?: throw AuthenticationException("Token sem jsessionid")
            val idusu = jwt.getClaim("idusu").asString() ?: "0"
            val server = jwt.getClaim("server").asString() ?: "producao"

            return UserSessionDto(
                idusu = idusu,
                username = username,
                jsessionid = jsessionid,
                server = server
            )
        } catch (e: JWTVerificationException) {
            throw AuthenticationException("Token inválido ou expirado: ${e.message}")
        }
    }
}
