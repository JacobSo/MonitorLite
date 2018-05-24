package com.monitorlite;

import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

public class MyAdapter extends BaseAdapter {

    private LayoutInflater mInflater;
    private String[] items;
    private String[] colors;
    private Context context;

    public MyAdapter(Context context, String[] items,String[] colors){
        this.mInflater = LayoutInflater.from(context);
        this.items = items;
        this.context = context;
        this.colors = colors;
    }
    @Override
    public int getCount() {
        // TODO Auto-generated method stub
        return items.length;
    }

    @Override
    public Object getItem(int arg0) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public long getItemId(int arg0) {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {

        ViewHolder holder = null;
        if (convertView == null) {

            holder=new ViewHolder();

            convertView = mInflater.inflate(R.layout.item_select, null);
            holder.title = convertView.findViewById(R.id.text_view);
            holder.flag = convertView.findViewById(R.id.flag_view);
            convertView.setTag(holder);

        }else {
            holder = (ViewHolder)convertView.getTag();
        }
        holder.title.setText(items[position]);
        holder.flag.setBackgroundColor(Color.parseColor(colors[position]));

        return convertView;
    }
    public final class ViewHolder{
        public TextView title;
        public View flag;
    }
}