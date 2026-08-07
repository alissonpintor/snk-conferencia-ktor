package com.snk.conferencia.plugins

import com.snk.conferencia.auth.AuthService
import com.snk.conferencia.auth.JwtProvider
import com.snk.conferencia.auth.authRoutes
import com.snk.conferencia.features.conferencia.ConferenciaServiceInterface
import com.snk.conferencia.features.conferencia.conferenciaRoutes
import com.snk.conferencia.features.lookup.LookupServiceInterface
import com.snk.conferencia.features.lookup.lookupRoutes
import com.snk.conferencia.features.separacao.SeparacaoServiceInterface
import com.snk.conferencia.features.separacao.separacaoRoutes
import io.ktor.server.application.*
import io.ktor.server.plugins.swagger.*
import io.ktor.server.routing.*

fun Application.configureRouting(
    authService: AuthService,
    lookupService: LookupServiceInterface,
    separacaoService: SeparacaoServiceInterface,
    conferenciaService: ConferenciaServiceInterface,
    jwtProvider: JwtProvider? = null
) {
    routing {
        swaggerUI(path = "swagger", swaggerFile = "openapi/documentation.yaml")
        authRoutes(authService)
        lookupRoutes(lookupService, jwtProvider)
        separacaoRoutes(separacaoService, jwtProvider)
        conferenciaRoutes(conferenciaService, jwtProvider)
    }
}
