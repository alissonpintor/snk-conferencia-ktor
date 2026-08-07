package com.snk.conferencia.features.lookup

import com.snk.conferencia.shared.sankhya.SankhyaClientInterface
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.jsonPrimitive
import kotlinx.serialization.json.contentOrNull

interface LookupServiceInterface {
    suspend fun buscarEmpresas(baseUrl: String, jsessionid: String): List<EmpresaResponse>
    suspend fun buscarParceiros(baseUrl: String, jsessionid: String, busca: String?): List<ParceiroResponse>
    suspend fun buscarProdutos(baseUrl: String, jsessionid: String, busca: String?): List<ProdutoResponse>
}

class LookupService(
    private val sankhyaClient: SankhyaClientInterface
) : LookupServiceInterface {

    override suspend fun buscarEmpresas(baseUrl: String, jsessionid: String): List<EmpresaResponse> {
        val sql = "SELECT CODEMP, NOMEFANTASIA, RAZAOSOCIAL FROM TSIEMP ORDER BY CODEMP"
        val response = sankhyaClient.executeQuery(baseUrl, jsessionid, sql)
        val rows = parseDbExplorerRows(response.responseBody)

        return rows.map { row ->
            val id = row["CODEMP"] ?: ""
            val nomeFantasia = row["NOMEFANTASIA"]
            val razaoSocial = row["RAZAOSOCIAL"]
            val title = if (!nomeFantasia.isNullOrBlank()) nomeFantasia else (razaoSocial ?: id)

            EmpresaResponse(
                id = id,
                title = title,
                subtitle = razaoSocial
            )
        }
    }

    override suspend fun buscarParceiros(baseUrl: String, jsessionid: String, busca: String?): List<ParceiroResponse> {
        val termo = busca?.trim() ?: ""
        if (termo.isEmpty()) return emptyList()

        val sql = if (termo.toLongOrNull() != null) {
            "SELECT CODPARC, NOMEPARC, RAZAOSOCIAL FROM TGFPAR WHERE CODPARC = ${termo.toLong()} AND ATIVO = 'S'"
        } else {
            val termoSanitizado = sanitizeSqlLike(termo)
            "SELECT CODPARC, NOMEPARC, RAZAOSOCIAL FROM TGFPAR WHERE (UPPER(NOMEPARC) LIKE '%$termoSanitizado%' OR UPPER(RAZAOSOCIAL) LIKE '%$termoSanitizado%') AND ATIVO = 'S' AND ROWNUM <= 50 ORDER BY NOMEPARC"
        }

        val response = sankhyaClient.executeQuery(baseUrl, jsessionid, sql)
        val rows = parseDbExplorerRows(response.responseBody)

        return rows.map { row ->
            ParceiroResponse(
                id = row["CODPARC"] ?: "",
                title = row["NOMEPARC"] ?: "",
                subtitle = row["RAZAOSOCIAL"]
            )
        }
    }

    override suspend fun buscarProdutos(baseUrl: String, jsessionid: String, busca: String?): List<ProdutoResponse> {
        val termo = busca?.trim() ?: ""
        if (termo.isEmpty()) return emptyList()

        val num = termo.toLongOrNull()
        val sql = if (num != null) {
            "SELECT CODPROD, DESCRPROD, MARCA FROM TGFPRO WHERE CODPROD = $num AND ATIVO = 'S'"
        } else {
            val termoSanitizado = sanitizeSqlLike(termo)
            "SELECT CODPROD, DESCRPROD, MARCA FROM TGFPRO WHERE UPPER(DESCRPROD) LIKE '%$termoSanitizado%' AND ATIVO = 'S' AND ROWNUM <= 50 ORDER BY DESCRPROD"
        }

        val response = sankhyaClient.executeQuery(baseUrl, jsessionid, sql)
        val rows = parseDbExplorerRows(response.responseBody)

        return rows.map { row ->
            ProdutoResponse(
                id = row["CODPROD"] ?: "",
                title = row["DESCRPROD"] ?: "",
                subtitle = row["MARCA"]
            )
        }
    }

    private fun sanitizeSqlLike(input: String): String {
        return input.replace("'", "''")
            .replace("%", "\\%")
            .replace("_", "\\_")
            .uppercase()
    }

    private fun parseDbExplorerRows(responseBody: JsonObject?): List<Map<String, String>> {
        if (responseBody == null) return emptyList()

        val fieldsMetadata = responseBody["fieldsMetadata"] as? JsonArray ?: return emptyList()
        val rows = responseBody["rows"] as? JsonArray ?: return emptyList()

        val fieldNames = fieldsMetadata.mapNotNull {
            (it as? JsonObject)?.get("name")?.jsonPrimitive?.contentOrNull
        }

        return rows.mapNotNull { row ->
            val rowArray = row as? JsonArray ?: return@mapNotNull null
            val map = mutableMapOf<String, String>()
            fieldNames.forEachIndexed { index, name ->
                val value = rowArray.getOrNull(index)?.jsonPrimitive?.contentOrNull ?: ""
                map[name] = value
            }
            map
        }
    }
}
