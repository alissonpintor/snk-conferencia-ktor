package com.snk.conferencia.auth

import com.snk.conferencia.plugins.AuthenticationException
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Routing.authRoutes(authService: AuthServiceInterface) {
    route("/api/v1/auth") {
        post("/login") {
            val credentials = call.receive<AuthCredentialsDto>()
            val tokenResponse = authService.authenticate(credentials)
            call.respond(HttpStatusCode.OK, tokenResponse)
        }

        get("/verify") {
            val authHeader = call.request.headers[HttpHeaders.Authorization]
                ?: throw AuthenticationException("Cabeçalho de Autorização ausente.")

            val userSession = authService.verifyToken(authHeader)
            call.respond(HttpStatusCode.OK, userSession)
        }

        post("/logout") {
            val authHeader = call.request.headers[HttpHeaders.Authorization]
            authService.logout(authHeader)
            call.respond(HttpStatusCode.OK, mapOf("message" to "Sessão encerrada com sucesso no Sankhya."))
        }
    }
}
