package com.onereva.simpos.manager

import android.graphics.Bitmap
import com.dantsu.escposprinter.EscPosPrinter
import com.dantsu.escposprinter.connection.tcp.TcpConnection
import com.dantsu.escposprinter.textparser.PrinterTextParserImg


class NetworkPrinterManager {
    fun splitBitmap(bitmap: Bitmap): Array<Bitmap?>? {
        val partHeight = 50
        val parts = Math.ceil(bitmap.height.toDouble() / partHeight).toInt()
        val bitmaps = arrayOfNulls<Bitmap>(parts)
        for (i in 0 until parts) {
            bitmaps[i] = Bitmap.createBitmap(bitmap, 0, partHeight * i, bitmap.width, if (i == bitmaps.size - 1) bitmap.height - (parts - 1) * partHeight else partHeight)
        }
        return bitmaps
    }

    fun printBitmap(bitmap: Bitmap?, ip: String?) {
        Thread {
            try {
                val printer = EscPosPrinter(TcpConnection(ip, 9100), 203, 60f, 32)
                val builder = StringBuilder("")
                val bitmaps = splitBitmap(bitmap!!)
                for (bm in bitmaps!!) {
                    builder.append("""
    [C]<img>${PrinterTextParserImg.bitmapToHexadecimalString(printer, bm)}</img>
    """.trimIndent())
                }
                builder.append("[L]\n")
                printer.printFormattedTextAndCut(builder.toString())
                printer.disconnectPrinter()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }.start()
    }

    companion object {
        val instance = NetworkPrinterManager()
    }
}
