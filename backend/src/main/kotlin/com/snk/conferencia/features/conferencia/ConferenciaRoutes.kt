package com.snk.conferencia.features.conferencia

import com.snk.conferencia.auth.JwtProvider
import com.snk.conferencia.shared.sankhya.extractSankhyaSession
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.conferenciaRoutes(conferenciaService: ConferenciaServiceInterface, jwtProvider: JwtProvider? = null) {
    route("/api/v1/conferencia") {
        post("/search") {
            val session = call.extractSankhyaSession(jwtProvider)
            val request = call.receive<BuscarConferenciaRequest>()
            val resultado = conferenciaService.buscarConferencia(session.baseUrl, session.jsessionid, request)
            call.respond(HttpStatusCode.OK, resultado)
        }

        post("/iniciar") {
            val session = call.extractSankhyaSession(jwtProvider)
            val request = call.receive<IniciarConferenciaRequest>()
            val resultado = conferenciaService.iniciarConferencia(session.baseUrl, session.jsessionid, session.userId, request)
            call.respond(HttpStatusCode.OK, resultado)
        }

        get("/pendentes") {
            val session = call.extractSankhyaSession(jwtProvider)
            val resultado = conferenciaService.buscarTarefasPendentes(session.baseUrl, session.jsessionid, session.userId)
            call.respond(HttpStatusCode.OK, resultado)
        }

        post("/itens") {
            val session = call.extractSankhyaSession(jwtProvider)
            val request = call.receive<BuscarItensConferenciaRequest>()
            val resultado = conferenciaService.buscarItensConferencia(session.baseUrl, session.jsessionid, request.nroConferencia, request.codProduto, request.codBarra)
            call.respond(HttpStatusCode.OK, resultado)
        }

        post("/info") {
            val session = call.extractSankhyaSession(jwtProvider)
            val request = call.receive<InfoProdutoRequest>()
            val resultado = conferenciaService.obterInfoProduto(session.baseUrl, session.jsessionid, session.userId, request)
            call.respond(HttpStatusCode.OK, resultado)
        }

        post("/registrar") {
            val session = call.extractSankhyaSession(jwtProvider)
            val request = call.receive<RegistrarItemConferidoRequest>()
            val resultado = conferenciaService.registrarItemConferido(session.baseUrl, session.jsessionid, session.userId, request)
            call.respond(HttpStatusCode.OK, resultado)
        }

        post("/itens/saldo") {
            val session = call.extractSankhyaSession(jwtProvider)
            val request = call.receive<AtualizarSaldoRequest>()
            val resultado = conferenciaService.atualizarSaldoItem(session.baseUrl, session.jsessionid, request)
            call.respond(HttpStatusCode.OK, resultado)
        }

        post("/remover-itens") {
            val session = call.extractSankhyaSession(jwtProvider)
            val request = call.receive<RemoverItensRequest>()
            val resultado = conferenciaService.removerItens(session.baseUrl, session.jsessionid, session.userId, request)
            call.respond(HttpStatusCode.OK, resultado)
        }

        post("/finalizar") {
            val session = call.extractSankhyaSession(jwtProvider)
            val request = call.receive<FinalizarConferenciaRequest>()
            val resultado = conferenciaService.finalizarConferencia(session.baseUrl, session.jsessionid, session.userId, request)
            call.respond(HttpStatusCode.OK, resultado)
        }

        post("/volumes") {
            val session = call.extractSankhyaSession(jwtProvider)
            val request = call.receive<RegistrarVolumesRequest>()
            val resultado = conferenciaService.registrarVolumes(session.baseUrl, session.jsessionid, session.userId, request)
            call.respond(HttpStatusCode.OK, resultado)
        }

        post("/volumes/imprimir") {
            val session = call.extractSankhyaSession(jwtProvider)
            val request = call.receive<ImprimirVolumesRequest>()
            val resultadoHtml = conferenciaService.imprimirVolumes(session.baseUrl, session.jsessionid, request)
            call.respondText(resultadoHtml, ContentType.Text.Html, HttpStatusCode.OK)
        }

        post("/doca") {
            val session = call.extractSankhyaSession(jwtProvider)
            val request = call.receive<EnviarDocaRequest>()
            val resultado = conferenciaService.enviarParaDoca(session.baseUrl, session.jsessionid, session.userId, request)
            call.respond(HttpStatusCode.OK, resultado)
        }

        post("/cancelar") {
            val session = call.extractSankhyaSession(jwtProvider)
            val request = call.receive<CancelarConferenciaRequest>()
            val resultado = conferenciaService.cancelarConferencia(session.baseUrl, session.jsessionid, session.userId, request)
            call.respond(HttpStatusCode.OK, resultado)
        }
    }
}
