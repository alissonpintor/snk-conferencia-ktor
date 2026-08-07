package com.snk.conferencia.features.separacao

import com.snk.conferencia.auth.JwtProvider
import com.snk.conferencia.shared.sankhya.extractSankhyaSession
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.separacaoRoutes(separacaoService: SeparacaoServiceInterface, jwtProvider: JwtProvider? = null) {
    route("/api/v1/separacoes") {
        post("/search") {
            val session = call.extractSankhyaSession(jwtProvider)
            val filtros = call.receive<SeparacaoFilterRequest>()
            val separacoes = separacaoService.buscarSeparacoes(session.baseUrl, session.jsessionid, filtros)
            call.respond(HttpStatusCode.OK, separacoes)
        }

        get("/{nroSeparacao}/itens") {
            val session = call.extractSankhyaSession(jwtProvider)

            val nroSeparacaoParam = call.parameters["nroSeparacao"]
                ?: return@get call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Número de separação é obrigatório."))

            val nroSeparacao = nroSeparacaoParam.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Número de separação inválido."))

            val itens = separacaoService.buscarItens(session.baseUrl, session.jsessionid, nroSeparacao)
            call.respond(HttpStatusCode.OK, itens)
        }

        get("/{nroSeparacao}/volumes/quantidade") {
            val session = call.extractSankhyaSession(jwtProvider)

            val nroSeparacaoParam = call.parameters["nroSeparacao"]
                ?: return@get call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Número de separação é obrigatório."))

            val nroSeparacao = nroSeparacaoParam.toLongOrNull()
                ?: return@get call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Número de separação inválido."))

            val qtdVolumes = separacaoService.obterQuantidadeVolumes(session.baseUrl, session.jsessionid, nroSeparacao)
            call.respond(HttpStatusCode.OK, qtdVolumes)
        }

        post("/{nroSeparacao}/volumes") {
            val session = call.extractSankhyaSession(jwtProvider)

            val nroSeparacaoParam = call.parameters["nroSeparacao"]
                ?: return@post call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Número de separação é obrigatório."))

            val nroSeparacao = nroSeparacaoParam.toLongOrNull()
                ?: return@post call.respond(HttpStatusCode.BadRequest, mapOf("error" to "Número de separação inválido."))

            val request = call.receive<GerarVolumesRequest>()
            val resultado = separacaoService.gerarVolumes(session.baseUrl, session.jsessionid, nroSeparacao, request)
            call.respond(HttpStatusCode.Created, resultado)
        }
    }
}
