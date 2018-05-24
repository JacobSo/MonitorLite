package com.monitorlite;

import android.app.AlertDialog;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by Administrator on 2017/3/28.
 */

public class CommonModule extends ReactContextBaseJavaModule {


    public CommonModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "CommonModule";
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        Map<String, Object> constants = new HashMap<>();
        return constants;
    }


    //demo
    @ReactMethod
    public void show(String titleStr, String[] items, String[] colors, final Callback successCallback) {
        AlertDialog.Builder builder = new AlertDialog.Builder(getCurrentActivity());
        View view = View.inflate(getCurrentActivity(), R.layout.custom_dialog, null);
        builder.setView(view);
        TextView title = view.findViewById(R.id.title);
        title.setText(titleStr);
        ListView mListView = view.findViewById(R.id.listView);
        mListView.setAdapter(new MyAdapter(getCurrentActivity(), items, colors));
        mListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> arg0, View arg1, int arg2, long arg3) {
                successCallback.invoke(arg2);
            }
        });
        AlertDialog dialog = builder.create();
        dialog.show();
    }
}
