package com.onereva.simpos

import android.graphics.BitmapFactory
import android.util.Base64
import android.webkit.JavascriptInterface
import com.onereva.simpos.manager.NetworkPrinterManager
import com.onereva.simpos.manager.SunmiPrintManager

class SimposJsObject {

    @JavascriptInterface
    fun printReceipt(base64: String) {
        val options = BitmapFactory.Options()
        options.inTargetDensity = 160
        options.inDensity = 160
        try {
            val decodedString = Base64.decode(base64, Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
            SunmiPrintManager.instance.setAlign(1)
            SunmiPrintManager.instance.printBitmap(bitmap)
            SunmiPrintManager.instance.feedPaper()
            SunmiPrintManager.instance.cutpaper()
            SunmiPrintManager.instance.openCashBox()

        } catch (e: Exception) {
            e.printStackTrace()
        }
    }


    @JavascriptInterface
    fun printRestaurantOrder(data: String) {
        try {
            val parts = data.split("SIMPOS").toTypedArray()
            val decodedString = Base64.decode(parts[1], Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
            NetworkPrinterManager.instance.printBitmap(bitmap, parts[0])
        } catch (e: java.lang.Exception) {
            e.printStackTrace()
        }
    }
}
