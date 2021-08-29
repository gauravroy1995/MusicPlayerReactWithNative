package com.musicapp;
import android.Manifest;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Environment;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.karumi.dexter.Dexter;
import com.karumi.dexter.PermissionToken;
import com.karumi.dexter.listener.PermissionDeniedResponse;
import com.karumi.dexter.listener.PermissionGrantedResponse;
import com.karumi.dexter.listener.PermissionRequest;
import com.karumi.dexter.listener.single.PermissionListener;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

public class MusicPlayerClass extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    private  ArrayList<File> mysongs;

    private String[] items;

    MusicPlayerClass(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "MusicPlayerModule";
    }

    @ReactMethod
    public void createMusicEvent(String name, String location, Promise promise) {

        mysongs = findSong(Environment.getExternalStorageDirectory());

         items = new String[mysongs.size()];

        WritableMap map = Arguments.createMap();



        for(int i =0; i< mysongs.size();i++){
            items[i] = mysongs.get(i).getName().toString();
//            mysongs.get(i).
            map.putString(String.valueOf(i),  mysongs.get(i).getName().toString());
            Log.d("here",mysongs.get(i).getPath().toString());
        }

        promise.resolve(map);

        Log.d("works","yahhh");
    }


    ArrayList<HashMap<String,String>> getPlayList(String rootPath) {
        ArrayList<HashMap<String,String>> fileList = new ArrayList<>();


        try {
            File rootFolder = new File(rootPath);
            File[] files = rootFolder.listFiles(); //here you will get NPE if directory doesn't contains  any file,handle it like this.
            for (File file : files) {
                if (file.isDirectory()) {
                    if (getPlayList(file.getAbsolutePath()) != null) {
                        fileList.addAll(getPlayList(file.getAbsolutePath()));
                    } else {
                        break;
                    }
                } else if (file.getName().endsWith(".mp3")) {
                    HashMap<String, String> song = new HashMap<>();
                    song.put("file_path", file.getAbsolutePath());
                    song.put("file_name", file.getName());
                    fileList.add(song);
                }
            }
            return fileList;
        } catch (Exception e) {
            return null;
        }
    }

    public ArrayList<File> findSong (File file){
        ArrayList<File> arrayList  = new ArrayList<>();

        File[] files = file.listFiles();

        for(File singleFile:files){
            if(singleFile.isDirectory() && !singleFile.isHidden()){
                arrayList.addAll(findSong(singleFile));

            }else{
                if(singleFile.getName().endsWith(".mp3")){
                    arrayList.add(singleFile);
                }
            }
        }
        return arrayList;
    };


    @ReactMethod
    public void playSong() throws IOException {
        try{
            Uri uri = Uri.parse(mysongs.get(0).toString());
            MediaPlayer mediaPlayer = MediaPlayer.create(reactContext,uri);
            mediaPlayer.start();

        } catch (Exception error){
            throw error;
        }



    }

    @ReactMethod
    public void getPermission(Promise promise){
        Dexter.withContext(reactContext.getApplicationContext()).withPermission(Manifest.permission.READ_EXTERNAL_STORAGE).withListener(new PermissionListener() {
            @Override
            public void onPermissionGranted(PermissionGrantedResponse permissionGrantedResponse) {
                promise.resolve("Permission granted");
        Log.d("permission","granted");
            }

            @Override
            public void onPermissionDenied(PermissionDeniedResponse permissionDeniedResponse) {

            }

            @Override
            public void onPermissionRationaleShouldBeShown(PermissionRequest permissionRequest, PermissionToken permissionToken) {

            }
        }).check();
    }
}
