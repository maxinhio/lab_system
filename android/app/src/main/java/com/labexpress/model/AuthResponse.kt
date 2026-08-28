package com.labexpress.model

data class AuthUser(val id_usuario: Int, val username: String, val id_rol: Int, val rol: String)
data class AuthResponse(val user: AuthUser, val token: String)
