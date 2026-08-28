package com.labexpress.ui

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import android.widget.TextView

class PatientDashboardActivity: AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val tv = TextView(this)
        tv.text = "Mis análisis - (pendiente: consultar API en implementation)"
        setContentView(tv)
    }
}
