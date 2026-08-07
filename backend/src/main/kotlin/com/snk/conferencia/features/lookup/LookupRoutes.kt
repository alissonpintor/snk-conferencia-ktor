package com.snk.conferencia.features.lookup

import com.snk.conferencia.auth.JwtProvider
import com.snk.conferencia.shared.sankhya.extractSankhyaSession
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.lookupRoutes(lookupService: LookupServiceInterface, jwtProvider: JwtProvider? = null) {
    route("/api/v1") {
        get("/empresas") {
            val session = call.extractSankhyaSession(jwtProvider)
            val empresas = lookupService.buscarEmpresas(session.baseUrl, session.jsessionid)
            call.respond(HttpStatusCode.OK, empresas)
        }

        get("/parceiros") {
            val session = call.extractSankhyaSession(jwtProvider)
            val busca = call.request.queryParameters["q"]

            val parceiros = lookupService.buscarParceiros(session.baseUrl, session.jsessionid, busca)
            call.respond(HttpStatusCode.OK, parceiros)
        }

        get("/produtos") {
            val session = call.extractSankhyaSession(jwtProvider)
            val busca = call.request.queryParameters["q"]

            val produtos = lookupService.buscarProdutos(session.baseUrl, session.jsessionid, busca)
            call.respond(HttpStatusCode.OK, produtos)
        }
    }
}
