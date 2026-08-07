package com.snk.conferencia.plugins

import com.snk.conferencia.auth.ErrorResponseDto
import com.snk.conferencia.shared.sankhya.SankhyaBusinessException
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import org.slf4j.LoggerFactory

class AuthenticationException(message: String) : RuntimeException(message)
class ValidationException(message: String) : RuntimeException(message)

fun Application.configureStatusPages() {
    val logger = LoggerFactory.getLogger("StatusPages")

    if (pluginOrNull(StatusPages) == null) {
        install(StatusPages) {
            exception<AuthenticationException> { call, cause ->
                logger.warn("Authentication failed: {}", cause.message)
                call.respond(
                    HttpStatusCode.Unauthorized,
                    ErrorResponseDto(
                        title = "Falha na Autenticação",
                        message = cause.message ?: "Credenciais inválidas ou sessão expirada",
                        status = HttpStatusCode.Unauthorized.value
                    )
                )
            }

            exception<ValidationException> { call, cause ->
                logger.warn("Validation error: {}", cause.message)
                call.respond(
                    HttpStatusCode.BadRequest,
                    ErrorResponseDto(
                        title = "Erro de Validação",
                        message = cause.message ?: "Parâmetros de requisição inválidos",
                        status = HttpStatusCode.BadRequest.value
                    )
                )
            }

            exception<IllegalArgumentException> { call, cause ->
                logger.warn("Illegal argument: {}", cause.message)
                call.respond(
                    HttpStatusCode.BadRequest,
                    ErrorResponseDto(
                        title = "Requisição Inválida",
                        message = cause.message ?: "Parâmetros informados estão incorretos",
                        status = HttpStatusCode.BadRequest.value
                    )
                )
            }

            exception<SankhyaBusinessException> { call, cause ->
                logger.warn("Sankhya business error: {}", cause.message)
                call.respond(
                    HttpStatusCode.BadRequest,
                    ErrorResponseDto(
                        title = "Erro Sankhya",
                        message = cause.message ?: "Erro de negócio retornado pelo ERP Sankhya",
                        status = HttpStatusCode.BadRequest.value
                    )
                )
            }

            exception<Throwable> { call, cause ->
                logger.error("Internal server error", cause)
                call.respond(
                    HttpStatusCode.InternalServerError,
                    ErrorResponseDto(
                        title = "Erro Interno",
                        message = "Ocorreu um erro interno no servidor. Tente novamente mais tarde.",
                        status = HttpStatusCode.InternalServerError.value
                    )
                )
            }
        }
    }
}
