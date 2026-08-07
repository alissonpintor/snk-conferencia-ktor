package com.snk.conferencia

import com.snk.conferencia.auth.*
import com.snk.conferencia.features.conferencia.*
import com.snk.conferencia.features.lookup.*
import com.snk.conferencia.features.separacao.*
import com.snk.conferencia.plugins.*
import com.snk.conferencia.shared.sankhya.SankhyaClient
import io.ktor.server.application.*

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    configureSerialization()
    configureStatusPages()
    configureSecurity()

    val config = environment.config
    val prodUrl = config.propertyOrNull("sankhya.prodUrl")?.getString() ?: "https://sankhya.stoky.com.br"
    val treinaUrl = config.propertyOrNull("sankhya.treinaUrl")?.getString() ?: "https://teste.stoky.com.br"
    val jwtSecret = config.propertyOrNull("jwt.secret")?.getString() ?: "snk-conferencia-secret-key-production-min-256-bits-super-secure"

    val jwtProvider = JwtProvider(secret = jwtSecret)
    val sankhyaAuthClient = SankhyaAuthClient(prodUrl = prodUrl, treinaUrl = treinaUrl)
    val authService = AuthService(sankhyaAuthClient = sankhyaAuthClient, jwtProvider = jwtProvider)

    val sankhyaClient = SankhyaClient()
    val lookupService = LookupService(sankhyaClient = sankhyaClient)
    val separacaoService = SeparacaoService(sankhyaClient = sankhyaClient)
    val conferenciaService = ConferenciaService(sankhyaClient = sankhyaClient)

    configureRouting(
        authService = authService,
        lookupService = lookupService,
        separacaoService = separacaoService,
        conferenciaService = conferenciaService,
        jwtProvider = jwtProvider
    )
}
