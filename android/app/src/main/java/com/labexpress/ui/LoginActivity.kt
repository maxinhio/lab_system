package com.labexpress.ui

import android.os.Bundle
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.labexpress.viewmodel.AuthViewModel
import android.widget.EditText
import android.widget.Button
import android.widget.Toast
import android.content.Intent
import com.labexpress.ui.FlebotomistDashboardActivity
import com.labexpress.ui.PatientDashboardActivity

class LoginActivity: AppCompatActivity() {
    private val vm: AuthViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Minimal UI: in real project use XML layout
        val username = EditText(this)
        username.hint = "Usuario"
        val password = EditText(this)
        password.hint = "Contraseña"
        password.inputType = android.text.InputType.TYPE_TEXT_VARIATION_PASSWORD
        val btn = Button(this)
        btn.text = "Entrar"
        val layout = android.widget.LinearLayout(this)
        layout.orientation = android.widget.LinearLayout.VERTICAL
        layout.setPadding(24,24,24,24)
        layout.addView(username)
        layout.addView(password)
        layout.addView(btn)
        setContentView(layout)

        btn.setOnClickListener {
            val u = username.text.toString(); val p = password.text.toString()
            vm.login(u,p)
        }

        vm.auth.observe(this) { auth ->
            if (auth != null) {
                Toast.makeText(this, "Autenticado: ${auth.user.username}", Toast.LENGTH_SHORT).show()
                // Navigate by role
                when (auth.user.rol) {
                    "Flebotomista" -> startActivity(Intent(this, FlebotomistDashboardActivity::class.java))
                    "Paciente" -> startActivity(Intent(this, PatientDashboardActivity::class.java))
                    else -> startActivity(Intent(this, FlebotomistDashboardActivity::class.java))
                }
                finish()
            }
        }

        vm.error.observe(this) { e -> if (e!=null) Toast.makeText(this,e,Toast.LENGTH_LONG).show() }
    }
}
