package com.snk.conferencia.auth

import com.snk.conferencia.plugins.ValidationException
import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

class AuthServiceTest {

    private val mockSankhyaClient = mockk<SankhyaAuthClientInterface>()
    private val jwtProvider = JwtProvider(secret = "test-secret-key-must-be-long-enough-256bits")
    private val authService = AuthService(mockSankhyaClient, jwtProvider)

    @Test
    fun `deve autenticar usuario e retornar TokenResponseDto`() = runBlocking {
        val credentials = AuthCredentialsDto("alisson", "studiowork", "producao")

        coEvery { mockSankhyaClient.login(any()) } returns SankhyaLoginResponseDto(
            status = "1",
            responseBody = SankhyaResponseBodyDto(
                jsessionid = SankhyaValueStringDto("SANKHYA_SESSION_999"),
                idusu = SankhyaValueStringDto("456")
            )
        )

        val result = authService.authenticate(credentials)

        assertNotNull(result.token)
        assertEquals("Bearer", result.tokenType)
        assertEquals("alisson", result.user.username)
        assertEquals("SANKHYA_SESSION_999", result.user.jsessionid)
    }

    @Test
    fun `deve lancar ValidationException se usuario for em branco`() {
        assertThrows<ValidationException> {
            runBlocking {
                authService.authenticate(AuthCredentialsDto("", "pass", "producao"))
            }
        }
    }

    @Test
    fun `deve chamar logout no Sankhya com jsessionid do token`() = runBlocking {
        val userSession = UserSessionDto("123", "alisson", "SESSION-XYZ-888", "producao")
        val token = jwtProvider.generateToken(userSession)

        coEvery { mockSankhyaClient.logout("SESSION-XYZ-888", "producao") } returns true

        val success = authService.logout("Bearer $token")
        kotlin.test.assertTrue(success)
    }
}
