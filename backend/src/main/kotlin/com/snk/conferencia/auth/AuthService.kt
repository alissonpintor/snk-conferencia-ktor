package com.snk.conferencia.auth

import com.snk.conferencia.plugins.ValidationException

interface AuthServiceInterface {
    suspend fun authenticate(credentials: AuthCredentialsDto): TokenResponseDto
    fun verifyToken(token: String): UserSessionDto
    suspend fun logout(authHeader: String?): Boolean
}

class AuthService(
    private val sankhyaAuthClient: SankhyaAuthClientInterface,
    private val jwtProvider: JwtProvider
) : AuthServiceInterface {

    override suspend fun authenticate(credentials: AuthCredentialsDto): TokenResponseDto {
        if (credentials.username.isBlank()) {
            throw ValidationException("O nome de usuário é obrigatório.")
        }
        if (credentials.password.isBlank()) {
            throw ValidationException("A senha é obrigatória.")
        }

        val server = if (credentials.server.isBlank()) "producao" else credentials.server.lowercase()
        val normalizedCredentials = credentials.copy(server = server)

        val sankhyaResponse = sankhyaAuthClient.login(normalizedCredentials)
        val responseBody = sankhyaResponse.responseBody!!
        val jsessionid = responseBody.jsessionid!!.`$`!!

        val rawIdUsu = responseBody.idusu?.`$`
        val idusu = if (sankhyaAuthClient is SankhyaAuthClient) {
            sankhyaAuthClient.parseIdUsu(rawIdUsu)
        } else {
            rawIdUsu ?: "0"
        }

        val userSession = UserSessionDto(
            idusu = idusu,
            username = normalizedCredentials.username,
            jsessionid = jsessionid,
            server = server
        )

        val token = jwtProvider.generateToken(userSession)

        return TokenResponseDto(
            token = token,
            tokenType = "Bearer",
            expiresIn = 86400L, // 24 Horas em segundos
            user = userSession
        )
    }

    override fun verifyToken(token: String): UserSessionDto {
        val cleanToken = if (token.startsWith("Bearer ", ignoreCase = true)) {
            token.substring(7).trim()
        } else {
            token.trim()
        }

        if (cleanToken.isBlank()) {
            throw ValidationException("Token de autenticação ausente ou em formato inválido.")
        }

        return jwtProvider.verifyToken(cleanToken)
    }

    override suspend fun logout(authHeader: String?): Boolean {
        if (authHeader.isNullOrBlank()) return true

        return try {
            val session = verifyToken(authHeader)
            sankhyaAuthClient.logout(session.jsessionid, session.server)
        } catch (e: Exception) {
            // Se o token estiver expirado ou inválido, o logout local prossegue
            true
        }
    }
}
