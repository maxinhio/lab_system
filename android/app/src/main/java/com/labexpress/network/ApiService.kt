package com.labexpress.network

import com.labexpress.model.AuthResponse
import com.labexpress.model.LoginRequest
import com.labexpress.model.MuestraRecoleccionRequest
import okhttp3.ResponseBody
import retrofit2.Response
import retrofit2.http.*

interface ApiService {
    @POST("/api/auth/login")
    suspend fun login(@Body req: LoginRequest): Response<AuthResponse>

    @POST("/api/muestras/{id}/recoleccion")
    suspend fun postRecoleccion(@Path("id") id: String, @Body body: MuestraRecoleccionRequest): Response<ResponseBody>

    @GET("/api/reportes/{ordenId}/pdf")
    suspend fun getReportePdf(@Path("ordenId") ordenId: Int): Response<ResponseBody>
}
