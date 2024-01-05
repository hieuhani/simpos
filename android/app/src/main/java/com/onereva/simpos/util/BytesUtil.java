package com.onereva.simpos.util;

import android.graphics.Bitmap;

public class BytesUtil {
    private static byte RGB2Gray(int r, int g, int b) {
        return (((int) (0.29900 * r + 0.58700 * g + 0.11400 * b) < 200)) ? (byte) 1 : (byte) 0;
    }
    public static byte[] getBytesFromBitMap(Bitmap bitmap) {
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int bw = (width - 1) / 8 + 1;

        byte[] rv = new byte[height * bw + 4];
        rv[0] = (byte) bw;//xL
        rv[1] = (byte) (bw >> 8);//xH
        rv[2] = (byte) height;
        rv[3] = (byte) (height >> 8);

        int[] pixels = new int[width * height];
        bitmap.getPixels(pixels, 0, width, 0, 0, width, height);

        for (int i = 0; i < height; i++) {
            for (int j = 0; j < width; j++) {
                int clr = pixels[width * i + j];
                int red = (clr & 0x00ff0000) >> 16;
                int green = (clr & 0x0000ff00) >> 8;
                int blue = clr & 0x000000ff;
                byte gray = (RGB2Gray(red, green, blue));
                rv[bw*i + j/8 + 4] = (byte) (rv[bw*i + j/8 + 4] | (gray << (7 - j % 8)));
            }
        }

        return rv;
    }

    public static byte[] getBytesFromBitMap(Bitmap bitmap, int mode) {
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int[] pixels = new int[width*height];
        if(mode == 0 || mode == 1){
            byte[] res = new byte[width*height/8 + 5*height/8];
            bitmap.getPixels(pixels, 0, width, 0, 0, width, height);
            for(int i = 0; i < height/8; i++){
                res[0 + i*(width+5)] = 0x1b;
                res[1 + i*(width+5)] = 0x2a;
                res[2 + i*(width+5)] = (byte) mode;
                res[3 + i*(width+5)] = (byte) (width%256);
                res[4 + i*(width+5)] = (byte) (width/256);
                for(int j = 0; j < width; j++){
                    byte gray = 0;
                    for(int m = 0; m < 8; m++){
                        int clr = pixels[j + width*(i*8+m)];
                        int red = (clr & 0x00ff0000) >> 16;
                        int green = (clr & 0x0000ff00) >> 8;
                        int blue = clr & 0x000000ff;
                        gray = (byte) ((RGB2Gray(red, green, blue)<<(7-m))|gray);
                    }
                    res[5 + j + i*(width+5)] = gray;
                }
            }
            return res;
        }else if(mode == 32 || mode == 33){
            byte[] res = new byte[width*height/8 + 5*height/24];
            bitmap.getPixels(pixels, 0, width, 0, 0, width, height);
            for(int i = 0; i < height/24; i++){
                res[0 + i*(width*3+5)] = 0x1b;
                res[1 + i*(width*3+5)] = 0x2a;
                res[2 + i*(width*3+5)] = (byte) mode;
                res[3 + i*(width*3+5)] = (byte) (width%256);
                res[4 + i*(width*3+5)] = (byte) (width/256);
                for(int j = 0; j < width; j++){
                    for(int n = 0; n < 3; n++){
                        byte gray = 0;
                        for(int m = 0; m < 8; m++){
                            int clr = pixels[j + width*(i*24 + m + n*8)];
                            int red = (clr & 0x00ff0000) >> 16;
                            int green = (clr & 0x0000ff00) >> 8;
                            int blue = clr & 0x000000ff;
                            gray = (byte) ((RGB2Gray(red, green, blue)<<(7-m))|gray);
                        }
                        res[5 + j*3 + i*(width*3+5) + n] = gray;
                    }
                }
            }
            return res;
        }else{
            return new byte[]{0x0A};
        }

    }

    public static byte[] byteMerger(byte[] byte_1, byte[] byte_2) {
        byte[] byte_3 = new byte[byte_1.length + byte_2.length];
        System.arraycopy(byte_1, 0, byte_3, 0, byte_1.length);
        System.arraycopy(byte_2, 0, byte_3, byte_1.length, byte_2.length);
        return byte_3;
    }
}
