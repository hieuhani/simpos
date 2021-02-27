package com.simposmobile;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class SunmiModule extends ReactContextBaseJavaModule {

  SunmiModule(ReactApplicationContext context) {
    super(context);
  }

  @NonNull
  @Override
  public String getName() {
    return "SunmiModule";
  }

  @ReactMethod
  public void sayYeah(String name) {
    System.out.println(name);
  }

  @ReactMethod
  public void initSunmiPrinterService() {
    SunmiPrintHelper.getInstance().initSunmiPrinterService(this.getReactApplicationContext());
  }

  @ReactMethod
  public void  printBitmapFromBase64(String base64) {
    BitmapFactory.Options options = new BitmapFactory.Options();
    options.inTargetDensity = 160;
    options.inDensity = 160;
    byte[] decodedString = Base64.decode(base64, Base64.DEFAULT);
    Bitmap bitmap = BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length, options);
    SunmiPrintHelper.getInstance().setAlign(1);
    SunmiPrintHelper.getInstance().printBitmap(bitmap);
    SunmiPrintHelper.getInstance().feedPaper();
    SunmiPrintHelper.getInstance().cutpaper();
    SunmiPrintHelper.getInstance().openCashBox();
  }
}
