package com.labexpress.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import androidx.lifecycle.MutableLiveData
import com.labexpress.network.NetworkModule
import com.labexpress.repository.AuthRepository
import com.labexpress.model.AuthResponse

class AuthViewModel(application: Application): AndroidViewModel(application) {
    val loading = MutableLiveData<Boolean>()
    val error = MutableLiveData<String?>()
    val auth = MutableLiveData<AuthResponse?>()

    private val api = NetworkModule.provideRetrofit().create(com.labexpress.network.ApiService::class.java)
    private val repo = AuthRepository(api, application.applicationContext)

    fun login(username: String, password: String) {
        loading.value = true
        viewModelScope.launch {
            try {
                val resp = repo.login(username, password)
                if (resp.isSuccessful && resp.body()!=null) {
                    val body = resp.body()!!
                    repo.saveToken(body.token)
                    auth.postValue(body)
                } else {
                    error.postValue(resp.errorBody()?.string() ?: "Login failed")
                }
            } catch (e: Exception) {
                error.postValue(e.message)
            }
            loading.postValue(false)
        }
    }
}
