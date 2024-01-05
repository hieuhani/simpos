package com.onereva.simpos

import android.annotation.SuppressLint
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient

class MainActivity : AppCompatActivity() {
    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val mainWebView = findViewById<WebView>(R.id.main_webview)
        mainWebView.settings.javaScriptEnabled = true
        mainWebView.webViewClient = WebViewClient()
        mainWebView.webChromeClient = WebChromeClient()
        mainWebView.addJavascriptInterface(SimposJsObject(), "simpos")
        mainWebView.settings.domStorageEnabled = true

        mainWebView.loadUrl("https://chapos.procolla.com")
    }
}