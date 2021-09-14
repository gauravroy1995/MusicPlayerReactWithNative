package com.musicapp;
import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ContentResolver;
import android.database.Cursor;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
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

    MediaPlayer mediaPlayer;

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
        final Activity activity = getCurrentActivity();

        AsyncTask<Void,Void,Void> newAsyncTask = new AsyncTask<Void, Void, Void>() {
            @Override
            protected Void doInBackground(Void... voids) {
                mysongs = findSong(Environment.getExternalStorageDirectory());
//                Log.d("length",mysongs.get(0).getName());
                if(mysongs == null){
                    promise.resolve(null);
                    return null;
                }
                items = new String[mysongs.size()];

                WritableMap map = Arguments.createMap();



                for(int i =0; i< mysongs.size();i++){
                    items[i] = mysongs.get(i).getName().toString();
                    map.putString(String.valueOf(i),  mysongs.get(i).getName().toString());
//                    Log.d("here",mysongs.get(i).getPath().toString());
                }

                promise.resolve(map);
                return null;
            };
        };



        newAsyncTask.executeOnExecutor(AsyncTask.SERIAL_EXECUTOR);
        Log.d("works","yahhh");


    }



    public ArrayList<File> findSong (File file){
        ArrayList<File> arrayList  = new ArrayList<>();

        try{
            File[] files = file.listFiles();

            // if files return null then return from the loop
            if (files == null) {
                return arrayList;
            }

            // check for every file
            for(File singleFile:files){

                // if its directory again recursively call this func
                if(singleFile.isDirectory() && !singleFile.isHidden()){
                    if(singleFile.getAbsolutePath() != null){
                        arrayList.addAll(findSong(singleFile));
                    } else {
                        break;
                    }
                }else{
                    // else add file into array
                    if(singleFile.isFile()){
                        if(singleFile.getName().endsWith(".mp3")){
                            arrayList.add(singleFile);
                        }
                    }

                }
            }
            return arrayList;

        } catch(Exception e){
            Log.e("err",e.toString());
            return  null;
        }



    };


    @ReactMethod
    public void playSong(Integer position, Promise promise) throws IOException {
        try{
            if(mediaPlayer!=null && mediaPlayer.isPlaying()){
                mediaPlayer.stop();
            }
            Uri uri = Uri.parse(mysongs.get(position).toString());
            mediaPlayer = MediaPlayer.create(reactContext,uri);
            mediaPlayer.start();

            // return duration
           promise.resolve(mediaPlayer.getDuration());



        } catch (Exception error){
            throw error;
        }



    }

    @ReactMethod
    public void stopSong() throws IOException {
        try{
          if(mediaPlayer != null){
//              mediaPlayer.release();
              mediaPlayer.stop();
          }
        } catch (Exception error){
            throw error;
        }



    }

    @ReactMethod
    public void pauseSong() throws IOException {

        Log.d("pause","paused");
        try{
         if(mediaPlayer != null){
             if(mediaPlayer.isPlaying()){
                 Log.d("is playing","yes");
                 mediaPlayer.pause();
             }else{
                 Log.d("is not playing","yes");
                 mediaPlayer.start();
             }


         }

        } catch (Exception error){
            throw error;
        }



    }

    @ReactMethod
    public void getPermission(Promise promise){
        Dexter.withContext(reactContext.getApplicationContext()).withPermission(Manifest.permission.READ_EXTERNAL_STORAGE).withListener(new PermissionListener() {
            @Override
            public void onPermissionGranted(PermissionGrantedResponse permissionGrantedResponse) {
                promise.resolve(true);
        Log.d("permission","granted");
            }

            @Override
            public void onPermissionDenied(PermissionDeniedResponse permissionDeniedResponse) {
            promise.resolve(false);
            }

            @Override
            public void onPermissionRationaleShouldBeShown(PermissionRequest permissionRequest, PermissionToken permissionToken) {

            }
        }).check();
    }

}
