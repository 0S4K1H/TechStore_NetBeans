package com.techstore.mobile

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class RegisterActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        val createAccountButton = findViewById<Button>(R.id.buttonCreateAccount)
        val loginLink = findViewById<TextView>(R.id.textGoToLogin)

        createAccountButton.setOnClickListener {
            Toast.makeText(this, getString(R.string.register_success), Toast.LENGTH_SHORT).show()
            startActivity(Intent(this, HomeActivity::class.java))
        }

        loginLink.setOnClickListener {
            finish()
        }
    }
}
