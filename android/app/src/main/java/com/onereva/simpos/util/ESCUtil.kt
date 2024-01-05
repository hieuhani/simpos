package com.onereva.simpos.util

import android.graphics.Bitmap

//常用指令封装
object ESCUtil {
    const val ESC: Byte = 0x1B // Escape
    const val FS: Byte = 0x1C // Text delimiter
    const val GS: Byte = 0x1D // Group separator
    const val DLE: Byte = 0x10 // data link escape
    const val EOT: Byte = 0x04 // End of transmission
    const val ENQ: Byte = 0x05 // Enquiry character
    const val SP: Byte = 0x20 // Spaces
    const val HT: Byte = 0x09 // Horizontal list
    const val LF: Byte = 0x0A //Print and wrap (horizontal orientation)
    const val CR: Byte = 0x0D // Home key
    const val FF: Byte =
        0x0C // Carriage control (print and return to the standard mode (in page mode))
    const val CAN: Byte = 0x18 // Canceled (cancel print data in page mode)

    //初始化打印机
    fun init_printer(): ByteArray {
        val result = ByteArray(2)
        result[0] = ESC
        result[1] = 0x40
        return result
    }

    //打印浓度指令
    fun setPrinterDarkness(value: Int): ByteArray {
        val result = ByteArray(9)
        result[0] = GS
        result[1] = 40
        result[2] = 69
        result[3] = 4
        result[4] = 0
        result[5] = 5
        result[6] = 5
        result[7] = (value shr 8).toByte()
        result[8] = value.toByte()
        return result
    }



    //光栅位图打印
    fun printBitmap(bitmap: Bitmap?): ByteArray {
        val bytes1 = ByteArray(4)
        bytes1[0] = GS
        bytes1[1] = 0x76
        bytes1[2] = 0x30
        bytes1[3] = 0x00
        val bytes2: ByteArray = BytesUtil.getBytesFromBitMap(bitmap)
        return BytesUtil.byteMerger(bytes1, bytes2)
    }

    //光栅位图打印 设置mode
    fun printBitmap(bitmap: Bitmap?, mode: Int): ByteArray {
        val bytes1 = ByteArray(4)
        bytes1[0] = GS
        bytes1[1] = 0x76
        bytes1[2] = 0x30
        bytes1[3] = mode.toByte()
        val bytes2: ByteArray = BytesUtil.getBytesFromBitMap(bitmap)
        return BytesUtil.byteMerger(bytes1, bytes2)
    }

    //光栅位图打印
    fun printBitmap(bytes: ByteArray?): ByteArray {
        val bytes1 = ByteArray(4)
        bytes1[0] = GS
        bytes1[1] = 0x76
        bytes1[2] = 0x30
        bytes1[3] = 0x00
        return BytesUtil.byteMerger(bytes1, bytes)
    }

    /*
	*	选择位图指令 设置mode
	*	需要设置1B 33 00将行间距设为0
	 */
    fun selectBitmap(bitmap: Bitmap?, mode: Int): ByteArray {
        return BytesUtil.byteMerger(
            BytesUtil.byteMerger(
                byteArrayOf(0x1B, 0x33, 0x00),
                BytesUtil.getBytesFromBitMap(bitmap, mode)
            ), byteArrayOf(0x0A, 0x1B, 0x32)
        )
    }

    /**
     * 跳指定行数
     */
    fun nextLine(lineNum: Int): ByteArray {
        val result = ByteArray(lineNum)
        for (i in 0 until lineNum) {
            result[i] = LF
        }
        return result
    }

    // ------------------------style set-----------------------------
    //设置默认行间距
    fun setDefaultLineSpace(): ByteArray {
        return byteArrayOf(0x1B, 0x32)
    }

    //设置行间距
    fun setLineSpace(height: Int): ByteArray {
        return byteArrayOf(0x1B, 0x33, height.toByte())
    }

    // ------------------------underline-----------------------------
    //设置下划线1点
    fun underlineWithOneDotWidthOn(): ByteArray {
        val result = ByteArray(3)
        result[0] = ESC
        result[1] = 45
        result[2] = 1
        return result
    }

    //设置下划线2点
    fun underlineWithTwoDotWidthOn(): ByteArray {
        val result = ByteArray(3)
        result[0] = ESC
        result[1] = 45
        result[2] = 2
        return result
    }

    //取消下划线
    fun underlineOff(): ByteArray {
        val result = ByteArray(3)
        result[0] = ESC
        result[1] = 45
        result[2] = 0
        return result
    }
    // ------------------------bold-----------------------------
    /**
     * 字体加粗
     */
    fun boldOn(): ByteArray {
        val result = ByteArray(3)
        result[0] = ESC
        result[1] = 69
        result[2] = 0xF
        return result
    }

    /**
     * 取消字体加粗
     */
    fun boldOff(): ByteArray {
        val result = ByteArray(3)
        result[0] = ESC
        result[1] = 69
        result[2] = 0
        return result
    }

    // ------------------------character-----------------------------
    /*
	*单字节模式开启
	 */
    fun singleByte(): ByteArray {
        val result = ByteArray(2)
        result[0] = FS
        result[1] = 0x2E
        return result
    }

    /*
	*单字节模式关闭
 	*/
    fun singleByteOff(): ByteArray {
        val result = ByteArray(2)
        result[0] = FS
        result[1] = 0x26
        return result
    }

    /**
     * 设置单字节字符集
     */
    fun setCodeSystemSingle(charset: Byte): ByteArray {
        val result = ByteArray(3)
        result[0] = ESC
        result[1] = 0x74
        result[2] = charset
        return result
    }

    /**
     * 设置多字节字符集
     */
    fun setCodeSystem(charset: Byte): ByteArray {
        val result = ByteArray(3)
        result[0] = FS
        result[1] = 0x43
        result[2] = charset
        return result
    }
    // ------------------------Align-----------------------------
    /**
     * 居左
     */
    fun alignLeft(): ByteArray {
        val result = ByteArray(3)
        result[0] = ESC
        result[1] = 97
        result[2] = 0
        return result
    }

    /**
     * 居中对齐
     */
    fun alignCenter(): ByteArray {
        val result = ByteArray(3)
        result[0] = ESC
        result[1] = 97
        result[2] = 1
        return result
    }

    /**
     * 居右
     */
    fun alignRight(): ByteArray {
        val result = ByteArray(3)
        result[0] = ESC
        result[1] = 97
        result[2] = 2
        return result
    }

    //切刀
    fun cutter(): ByteArray {
        return byteArrayOf(0x1d, 0x56, 0x01)
    }

}