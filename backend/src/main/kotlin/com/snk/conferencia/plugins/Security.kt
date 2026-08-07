package com.snk.conferencia.plugins

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.defaultheaders.*

fun Application.configureSecurity() {
    if (pluginOrNull(DefaultHeaders) == null) {
        install(DefaultHeaders) {
            header("X-Content-Type-Options", "nosniff")
            header("X-Frame-Options", "DENY")
            header("Referrer-Policy", "strict-origin-when-cross-origin")
        }
    }

    if (pluginOrNull(CORS) == null) {
        install(CORS) {
            allowMethod(HttpMethod.Options)
            allowMethod(HttpMethod.Get)
            allowMethod(HttpMethod.Post)
            allowMethod(HttpMethod.Put)
            allowMethod(HttpMethod.Delete)

            allowHeader(HttpHeaders.Authorization)
            allowHeader(HttpHeaders.ContentType)
            allowHeader("X-Requested-With")

            // Explicitação de hosts seguros para desenvolvimento local e produção
            allowHost("localhost:8080", schemes = listOf("http", "https"))
            allowHost("127.0.0.1:8080", schemes = listOf("http", "https"))
            allowHost("localhost:5173", schemes = listOf("http", "https"))
            allowHost("127.0.0.1:5173", schemes = listOf("http", "https"))
            
            allowNonSimpleContentTypes = true
            allowCredentials = true
        }
    }
}
