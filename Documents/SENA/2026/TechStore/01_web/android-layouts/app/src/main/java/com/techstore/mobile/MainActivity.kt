package com.techstore.mobile

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val loginButton = findViewById<Button>(R.id.buttonLogin)
        val registerLink = findViewById<TextView>(R.id.textGoToRegister)
        val forgotLink = findViewById<TextView>(R.id.textForgotPassword)

        loginButton.setOnClickListener {
            Toast.makeText(this, getString(R.string.login_success), Toast.LENGTH_SHORT).show()
            startActivity(Intent(this, HomeActivity::class.java))
        }

        registerLink.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }

        forgotLink.setOnClickListener {
            Toast.makeText(this, "Recuperacion de acceso en construccion.", Toast.LENGTH_SHORT).show()
        }
    }
}
