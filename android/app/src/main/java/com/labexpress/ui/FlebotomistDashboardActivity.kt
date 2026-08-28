package com.labexpress.ui

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import android.widget.Button
import android.widget.LinearLayout

class FlebotomistDashboardActivity: AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val layout = LinearLayout(this)
        layout.orientation = LinearLayout.VERTICAL
        layout.setPadding(24,24,24,24)
        val btnScan = Button(this)
        btnScan.text = "Escanear QR"
        btnScan.setOnClickListener { startActivity(Intent(this, QRScannerActivity::class.java)) }
        layout.addView(btnScan)
        setContentView(layout)
    }
}
