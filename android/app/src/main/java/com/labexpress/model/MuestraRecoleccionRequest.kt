package com.labexpress.model

data class MuestraRecoleccionRequest(
    val codigo_qr: String,
    val latitud: Double,
    val longitud: Double,
    val fecha_hora: String
)
