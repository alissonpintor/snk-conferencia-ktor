package com.snk.conferencia.auth

import com.snk.conferencia.plugins.AuthenticationException
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

class JwtProviderTest {

    private val jwtProvider = JwtProvider(secret = "test-secret-key-must-be-long-enough-256bits")

    @Test
    fun `deve gerar e verificar token JWT com sucesso`() {
        val session = UserSessionDto(
            idusu = "123",
            username = "alisson",
            jsessionid = "SESSION-ABC-123",
            server = "producao"
        )

        val token = jwtProvider.generateToken(session)
        assertNotNull(token)

        val verifiedSession = jwtProvider.verifyToken(token)
        assertEquals("123", verifiedSession.idusu)
        assertEquals("alisson", verifiedSession.username)
        assertEquals("SESSION-ABC-123", verifiedSession.jsessionid)
        assertEquals("producao", verifiedSession.server)
    }

    @Test
    fun `deve rejeitar token com assinatura invalida`() {
        val session = UserSessionDto("123", "alisson", "S1", "producao")
        val token = jwtProvider.generateToken(session)

        val invalidProvider = JwtProvider(secret = "another-different-secret-key-256bits")
        assertThrows<AuthenticationException> {
            invalidProvider.verifyToken(token)
        }
    }
}
