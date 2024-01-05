package com.onereva.simpos.manager

import android.content.Context
import android.graphics.Bitmap
import android.os.RemoteException
import android.widget.Toast
import com.onereva.simpos.util.ESCUtil
import com.sunmi.peripheral.printer.*

/**
 * <pre>
 * This class is used to demonstrate various printing effects
 * Developers need to repackage themselves, for details please refer to
 * http://sunmi-ota.oss-cn-hangzhou.aliyuncs.com/DOC/resource/re_cn/Sunmiprinter%E5%BC%80%E5%8F%91%E8%80%85%E6%96%87%E6%A1%A31.1.191128.pdf
</pre> *
 *
 * @author kaltin
 * @since create at 2020-02-14
 */
class SunmiPrintManager private constructor() {
    /**
     * sunmiPrinter means checking the printer connection status
     */
    var sunmiPrinter = CheckSunmiPrinter

    /**
     * SunmiPrinterService for API
     */
    private var sunmiPrinterService: SunmiPrinterService? = null
    private val innerPrinterCallback: InnerPrinterCallback = object : InnerPrinterCallback() {
        override fun onConnected(service: SunmiPrinterService) {
            sunmiPrinterService = service
            checkSunmiPrinterService(service)
        }

        override fun onDisconnected() {
            sunmiPrinterService = null
            sunmiPrinter = LostSunmiPrinter
        }
    }

    /**
     * init sunmi print service
     */
    fun initSunmiPrinterService(context: Context?) {
        try {
            val ret = InnerPrinterManager.getInstance().bindService(
                context,
                innerPrinterCallback
            )
            if (!ret) {
                sunmiPrinter = NoSunmiPrinter
            }
        } catch (e: InnerPrinterException) {
            e.printStackTrace()
        }
    }

    /**
     * deInit sunmi print service
     */
    fun deInitSunmiPrinterService(context: Context?) {
        try {
            if (sunmiPrinterService != null) {
                InnerPrinterManager.getInstance().unBindService(context, innerPrinterCallback)
                sunmiPrinterService = null
                sunmiPrinter = LostSunmiPrinter
            }
        } catch (e: InnerPrinterException) {
            e.printStackTrace()
        }
    }

    /**
     * Check the printer connection,
     * like some devices do not have a printer but need to be connected to the cash drawer through a print service
     */
    private fun checkSunmiPrinterService(service: SunmiPrinterService) {
        var ret = false
        try {
            ret = InnerPrinterManager.getInstance().hasPrinter(service)
        } catch (e: InnerPrinterException) {
            e.printStackTrace()
        }
        sunmiPrinter =
            if (ret) FoundSunmiPrinter else NoSunmiPrinter
    }

    /**
     * Some conditions can cause interface calls to fail
     * For example: the version is too low、device does not support
     * You can see [ExceptionConst]
     * So you have to handle these exceptions
     */
    private fun handleRemoteException(e: RemoteException) {
        //TODO process when get one exception
    }

    /**
     * send esc cmd
     */
    fun sendRawData(data: ByteArray?) {
        if (sunmiPrinterService == null) {
            //TODO Service disconnection processing
            return
        }
        try {
            sunmiPrinterService!!.sendRAWData(data, null)
        } catch (e: RemoteException) {
            handleRemoteException(e)
        }
    }

    /**
     * Printer cuts paper and throws exception on machines without a cutter
     */
    fun cutpaper() {
        if (sunmiPrinterService == null) {
            //TODO Service disconnection processing
            return
        }
        try {
            sunmiPrinterService!!.cutPaper(null)
        } catch (e: RemoteException) {
            handleRemoteException(e)
        }
    }

    /**
     * Initialize the printer
     * All style settings will be restored to default
     */
    fun initPrinter() {
        if (sunmiPrinterService == null) {
            //TODO Service disconnection processing
            return
        }
        try {
            sunmiPrinterService!!.printerInit(null)
        } catch (e: RemoteException) {
            handleRemoteException(e)
        }
    }

    /**
     * paper feed three lines
     * Not disabled when line spacing is set to 0
     */
    fun print3Line() {
        if (sunmiPrinterService == null) {
            //TODO Service disconnection processing
            return
        }
        try {
            sunmiPrinterService!!.lineWrap(3, null)
        } catch (e: RemoteException) {
            handleRemoteException(e)
        }
    }//TODO Service disconnection processing

    /**
     * Get printer serial number
     */
    val printerSerialNo: String
        get() = if (sunmiPrinterService == null) {
            //TODO Service disconnection processing
            ""
        } else try {
            sunmiPrinterService!!.printerSerialNo
        } catch (e: RemoteException) {
            handleRemoteException(e)
            ""
        }//TODO Service disconnection processing

    /**
     * Get device model
     */
    val deviceModel: String
        get() {
            return if (sunmiPrinterService == null) {
                //TODO Service disconnection processing
                ""
            } else try {
                sunmiPrinterService!!.printerModal
            } catch (e: RemoteException) {
                handleRemoteException(e)
                ""
            }
        }//TODO Service disconnection processing

    /**
     * Get firmware version
     */
    val printerVersion: String
        get() {
            return if (sunmiPrinterService == null) {
                //TODO Service disconnection processing
                ""
            } else try {
                sunmiPrinterService!!.printerVersion
            } catch (e: RemoteException) {
                handleRemoteException(e)
                ""
            }
        }//TODO Service disconnection processing

    /**
     * Get paper specifications
     */
    val printerPaper: String
        get() {
            return if (sunmiPrinterService == null) {
                //TODO Service disconnection processing
                ""
            } else try {
                if (sunmiPrinterService!!.printerPaper == 1) "58mm" else "80mm"
            } catch (e: RemoteException) {
                handleRemoteException(e)
                ""
            }
        }

    /**
     * Set printer alignment
     */
    fun setAlign(align: Int) {
        if (sunmiPrinterService == null) {
            //TODO Service disconnection processing
            return
        }
        try {
            sunmiPrinterService!!.setAlignment(align, null)
        } catch (e: RemoteException) {
            handleRemoteException(e)
        }
    }

    /**
     * Due to the distance between the paper hatch and the print head,
     * the paper needs to be fed out automatically
     * But if the Api does not support it, it will be replaced by printing three lines
     */
    fun feedPaper() {
        if (sunmiPrinterService == null) {
            //TODO Service disconnection processing
            return
        }
        try {
            sunmiPrinterService!!.autoOutPaper(null)
        } catch (e: RemoteException) {
            print3Line()
        }
    }

    /**
     * print text
     * setPrinterStyle Api require V4.2.22 or later, So use esc cmd instead when not supported
     * More settings reference documentation [WoyouConsts]
     */
    fun printText(
        content: String?,
        size: Float,
        isBold: Boolean,
        isUnderLine: Boolean
    ) {
        if (sunmiPrinterService == null) {
            //TODO Service disconnection processing
            return
        }
        try {
            try {
                sunmiPrinterService!!.setPrinterStyle(
                    WoyouConsts.ENABLE_BOLD,
                    if (isBold) WoyouConsts.ENABLE else WoyouConsts.DISABLE
                )
            } catch (e: RemoteException) {
                if (isBold) {
                    sunmiPrinterService!!.sendRAWData(ESCUtil.boldOn(), null)
                } else {
                    sunmiPrinterService!!.sendRAWData(ESCUtil.boldOff(), null)
                }
            }
            try {
                sunmiPrinterService!!.setPrinterStyle(
                    WoyouConsts.ENABLE_UNDERLINE,
                    if (isUnderLine) WoyouConsts.ENABLE else WoyouConsts.DISABLE
                )
            } catch (e: RemoteException) {
                if (isUnderLine) {
                    sunmiPrinterService!!.sendRAWData(ESCUtil.underlineWithOneDotWidthOn(), null)
                } else {
                    sunmiPrinterService!!.sendRAWData(ESCUtil.underlineOff(), null)
                }
            }
            sunmiPrinterService!!.printTextWithFont(content, null, size, null)
        } catch (e: RemoteException) {
            e.printStackTrace()
        }
    }

    /**
     * print Bar Code
     */
    fun printBarCode(
        data: String?,
        symbology: Int,
        height: Int,
        width: Int,
        textposition: Int
    ) {
        if (sunmiPrinterService == null) {
            //TODO Service disconnection processing
            return
        }
        try {
            sunmiPrinterService!!.printBarCode(data, symbology, height, width, textposition, null)
        } catch (e: RemoteException) {
            e.printStackTrace()
        }
    }

    /**
     * print Qr Code
     */
    fun printQr(data: String?, modulesize: Int, errorlevel: Int) {
        if (sunmiPrinterService == null) {
            //TODO Service disconnection processing
            return
        }
        try {
            sunmiPrinterService!!.printQRCode(data, modulesize, errorlevel, null)
        } catch (e: RemoteException) {
            e.printStackTrace()
        }
    }

    /**
     * Print a row of a table
     */
    fun printTable(
        txts: Array<String?>?,
        width: IntArray?,
        align: IntArray?
    ) {
        if (sunmiPrinterService == null) {
            //TODO Service disconnection processing
            return
        }
        try {
            sunmiPrinterService!!.printColumnsString(txts, width, align, null)
        } catch (e: RemoteException) {
            e.printStackTrace()
        }
    }

    fun printBitmap(bitmap: Bitmap) {
        if (sunmiPrinterService == null) {
            //TODO Service disconnection processing
            return
        }
        try {
            sunmiPrinterService!!.printBitmap(bitmap, null)
        } catch (e: RemoteException) {
            e.printStackTrace()
        }
    }


    /**
     * Gets whether the current printer is in black mark mode
     */
    val isBlackLabelMode: Boolean
        get() {
            return if (sunmiPrinterService == null) {
                //TODO Service disconnection processing
                false
            } else try {
                sunmiPrinterService!!.printerMode == 1
            } catch (e: RemoteException) {
                false
            }
        }//TODO Service disconnection processing

    /**
     * Gets whether the current printer is in label-printing mode
     */
    val isLabelMode: Boolean
        get() {
            return if (sunmiPrinterService == null) {
                //TODO Service disconnection processing
                false
            } else try {
                sunmiPrinterService!!.printerMode == 2
            } catch (e: RemoteException) {
                false
            }
        }


    /**
     * Open cash box
     * This method can be used on Sunmi devices with a cash drawer interface
     * If there is no cash box (such as V1、P1) or the call fails, an exception will be thrown
     *
     * Reference to https://docs.sunmi.com/general-function-modules/external-device-debug/cash-box-driver/}
     */
    fun openCashBox() {
        if (sunmiPrinterService == null) {
            //TODO Service disconnection processing
            return
        }
        try {
            sunmiPrinterService!!.openDrawer(null)
        } catch (e: RemoteException) {
            handleRemoteException(e)
        }
    }

    /**
     * LCD screen control
     * @param flag 1 —— Initialization
     * 2 —— Light up screen
     * 3 —— Extinguish screen
     * 4 —— Clear screen contents
     */
    fun controlLcd(flag: Int) {
        if (sunmiPrinterService == null) {
            //TODO Service disconnection processing
            return
        }
        try {
            sunmiPrinterService!!.sendLCDCommand(flag)
        } catch (e: RemoteException) {
            handleRemoteException(e)
        }
    }

    /**
     * Display text SUNMI,font size is 16 and format is fill
     * sendLCDFillString(txt, size, fill, callback)
     * Since the screen pixel height is 40, the font should not exceed 40
     */
    fun sendTextToLcd() {
        if (sunmiPrinterService == null) {
            //TODO Service disconnection processing
            return
        }
        try {
            sunmiPrinterService!!.sendLCDFillString("SUNMI", 16, true, object : InnerLcdCallback() {
                @Throws(RemoteException::class)
                override fun onRunResult(show: Boolean) {
                    //TODO handle result
                }
            })
        } catch (e: RemoteException) {
            e.printStackTrace()
        }
    }

    /**
     * Display two lines and one empty line in the middle
     */
    fun sendTextsToLcd() {
        if (sunmiPrinterService == null) {
            //TODO Service disconnection processing
            return
        }
        try {
            val texts =
                arrayOf("SUNMI", null, "SUNMI")
            val align = intArrayOf(2, 1, 2)
            sunmiPrinterService!!.sendLCDMultiString(texts, align, object : InnerLcdCallback() {
                @Throws(RemoteException::class)
                override fun onRunResult(show: Boolean) {
                    //TODO handle result
                }
            })
        } catch (e: RemoteException) {
            e.printStackTrace()
        }
    }

    /**
     * Display one 128x40 pixels and opaque picture
     */
    fun sendPicToLcd(pic: Bitmap?) {
        if (sunmiPrinterService == null) {
            //TODO Service disconnection processing
            return
        }
        try {
            sunmiPrinterService!!.sendLCDBitmap(pic, object : InnerLcdCallback() {
                @Throws(RemoteException::class)
                override fun onRunResult(show: Boolean) {
                    //TODO handle result
                }
            })
        } catch (e: RemoteException) {
            e.printStackTrace()
        }
    }

    /**
     * Used to report the real-time query status of the printer, which can be used before each
     * printing
     */
    fun showPrinterStatus(context: Context?) {
        if (sunmiPrinterService == null) {
            //TODO Service disconnection processing
            return
        }
        var result = "Interface is too low to implement interface"
        try {
            val res = sunmiPrinterService!!.updatePrinterState()
            when (res) {
                1 -> result = "printer is running"
                2 -> result = "printer found but still initializing"
                3 -> result = "printer hardware interface is abnormal and needs to be reprinted"
                4 -> result = "printer is out of paper"
                5 -> result = "printer is overheating"
                6 -> result = "printer's cover is not closed"
                7 -> result = "printer's cutter is abnormal"
                8 -> result = "printer's cutter is normal"
                9 -> result = "not found black mark paper"
                505 -> result = "printer does not exist"
                else -> {
                }
            }
        } catch (e: RemoteException) {
            e.printStackTrace()
        }
        Toast.makeText(context, result, Toast.LENGTH_LONG).show()
    }

    /**
     * Demo printing a label
     * After printing one label, in order to facilitate the user to tear the paper, call
     * labelOutput to push the label paper out of the paper hatch
     * 演示打印一张标签
     * 打印单张标签后为了方便用户撕纸可调用labelOutput,将标签纸推出纸舱口
     */
    fun printOneLabel() {
        if (sunmiPrinterService == null) {
            //TODO Service disconnection processing
            return
        }
        try {
            sunmiPrinterService!!.labelLocate()
            printLabelContent()
            sunmiPrinterService!!.labelOutput()
        } catch (e: RemoteException) {
            e.printStackTrace()
        }
    }

    /**
     * Demo printing multi label
     *
     * After printing multiple labels, choose whether to push the label paper to the paper hatch according to the needs
     * 演示打印多张标签
     * 打印多张标签后根据需求选择是否推出标签纸到纸舱口
     */
    fun printMultiLabel(num: Int) {
        if (sunmiPrinterService == null) {
            //TODO Service disconnection processing
            return
        }
        try {
            for (i in 0 until num) {
                sunmiPrinterService!!.labelLocate()
                printLabelContent()
            }
            sunmiPrinterService!!.labelOutput()
        } catch (e: RemoteException) {
            e.printStackTrace()
        }
    }

    /**
     *
     * Custom label ticket content
     * In the example, not all labels can be applied. In actual use, please pay attention to adapting the size of the label. You can adjust the font size and content position.
     * 自定义的标签小票内容
     * 例子中并不能适用所有标签纸，实际使用时注意要自适配标签纸大小，可通过调节字体大小，内容位置等方式
     */
    @Throws(RemoteException::class)
    private fun printLabelContent() {
        sunmiPrinterService!!.setPrinterStyle(WoyouConsts.ENABLE_BOLD, WoyouConsts.ENABLE)
        sunmiPrinterService!!.lineWrap(1, null)
        sunmiPrinterService!!.setAlignment(0, null)
        sunmiPrinterService!!.printText("商品         豆浆\n", null)
        sunmiPrinterService!!.printText("到期时间         12-13  14时\n", null)
        sunmiPrinterService!!.printBarCode("{C1234567890123456", 8, 90, 2, 2, null)
        sunmiPrinterService!!.lineWrap(1, null)
    }

    companion object {
        var NoSunmiPrinter = 0x00000000
        var CheckSunmiPrinter = 0x00000001
        var FoundSunmiPrinter = 0x00000002
        var LostSunmiPrinter = 0x00000003
        val instance = SunmiPrintManager()
    }
}