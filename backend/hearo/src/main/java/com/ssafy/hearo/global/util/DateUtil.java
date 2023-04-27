package com.ssafy.hearo.global.util;

import com.ssafy.hearo.global.error.code.CommonErrorCode;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

@Component
public class DateUtil {

    public Timestamp stringToTimestamp(String datetime) {
        try {
            SimpleDateFormat format = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
            Date formatDatetime = format.parse(datetime);
            Timestamp result = new Timestamp(formatDatetime.getTime());
            return result;
        } catch (ParseException e) {
            e.printStackTrace();
            return new Timestamp(1);
        }
    }

    public String timestampToString(Timestamp datetime) {
        String result = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss").format(datetime);
        return result;
    }

}
