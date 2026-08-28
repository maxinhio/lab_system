package com.labexpress.repository

import android.content.Context
import android.content.SharedPreferences
import com.labexpress.model.AuthResponse
import com.labexpress.model.LoginRequest
import com.labexpress.network.ApiService
import retrofit2.Response

class AuthRepository(private val api: ApiService, context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("labexpress_prefs", Context.MODE_PRIVATE)

    suspend fun login(username: String, password: String): Response<AuthResponse> {
        return api.login(LoginRequest(username, password))
    }

    fun saveToken(token: String) {
        prefs.edit().putString("token", token).apply()
    }

    fun getToken(): String? = prefs.getString("token", null)
}
