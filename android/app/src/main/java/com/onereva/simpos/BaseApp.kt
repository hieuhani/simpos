package com.onereva.simpos

import android.app.Application
import com.onereva.simpos.manager.SunmiPrintManager

class BaseApp : Application() {

    override fun onCreate() {
        super.onCreate()
        SunmiPrintManager.instance.initSunmiPrinterService(this)
    }
}