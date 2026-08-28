package com.labexpress.ui

import android.Manifest
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import android.widget.Toast
import com.google.android.material.button.MaterialButton
import android.widget.LinearLayout

// NOTE: This is a placeholder. For production use CameraX or ZXing embedded.
class QRScannerActivity: AppCompatActivity() {
    private val cameraPermissionLauncher = registerForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
        if (granted) startScan() else Toast.makeText(this, "Permiso de cámara requerido", Toast.LENGTH_SHORT).show()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val layout = LinearLayout(this)
        layout.orientation = LinearLayout.VERTICAL
        val btn = MaterialButton(this)
        btn.text = "Iniciar escáner (placeholder)"
        btn.setOnClickListener { checkCamera() }
        layout.addView(btn)
        setContentView(layout)
    }

    private fun checkCamera(){
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
        } else startScan()
    }

    private fun startScan(){
        // Placeholder: open external scanner if installed, else allow manual entry
        Toast.makeText(this, "Implement scanner with CameraX or ZXing", Toast.LENGTH_LONG).show()
        // For demo, finish with a fake code
        val intent = Intent()
        intent.putExtra("codigo_qr","MUE-20260827-0001")
        setResult(Activity.RESULT_OK, intent)
        finish()
    }
}
