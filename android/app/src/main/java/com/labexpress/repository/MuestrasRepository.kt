package com.labexpress.repository

import com.labexpress.model.MuestraRecoleccionRequest
import com.labexpress.network.ApiService
import okhttp3.ResponseBody
import retrofit2.Response

class MuestrasRepository(private val api: ApiService) {
    suspend fun enviarRecoleccion(id: String, body: MuestraRecoleccionRequest): Response<ResponseBody> {
        return api.postRecoleccion(id, body)
    }
}
