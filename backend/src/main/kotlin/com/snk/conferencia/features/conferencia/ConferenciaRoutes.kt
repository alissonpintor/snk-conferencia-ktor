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

        post("/volumes/imprimir") {
            val session = call.extractSankhyaSession(jwtProvider)

            val request = call.receive<ImprimirVolumesRequest>()
            val resultado = conferenciaService.imprimirVolumes(session.baseUrl, session.jsessionid, request)
            call.respond(HttpStatusCode.OK, resultado)
        }
    }
}
