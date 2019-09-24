/**
 *
 * @param timestamp 时间戳转换成时间
 * @returns {{s: *, D: *, h: *, Y: number, M: *, m: *}}
 */
const timestampToTime=function(timestamp){
    timestamp=timestamp.toString().length===10?timestamp * 1000:timestamp;//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let date = new Date(timestamp);
    let Y = date.getFullYear();
    let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
    let D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate());
    let h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours());
    let m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes());
    let s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
    let dateJson={
        'Y':Y,
        'M':M,
        'D':D,
        'h':h,
        'm':m,
        's':s
    };
    return dateJson;
};

/**
 * 获取某个时间戳所在那天的开始和截止时间
 * @param time
 * @returns {{startTime: number, endTime: number}}
 */
const getDayStartAndEnd=function(time){//该时间的当天0点和24点
    time=time.toString().length===10?time * 1000:time;//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let startTime=new Date(time).setHours(0,0,0,0);
    let endTime=new Date(time).setHours(23,59,59,999);
    return {
        startTime:startTime,
        endTime:endTime
    }
};

/**
 * 判断目标时间是否是本周
 * @param time
 * @returns {string|boolean}
 */
const isCurrentWeek=function(time,type=1){//time为目标时间戳
    time=time.toString().length===10?time * 1000:time;//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    // 当前时间   
    let timestamp = Date.parse(new Date());
    let serverDate = new Date(timestamp);

    //本周周日的时间戳   
    let sundayTiem = timestamp + ((7 - serverDate.getDay())* 24 * 60 * 60 * 1000);
    //周日24点的时间戳
    let sundayTiemEnd = getDayStartAndEnd(sundayTiem).endTime;

    // 本周周一的时间戳  
    let mondayTime = timestamp - ((serverDate.getDay()-1) * 24 * 60 * 60 * 1000);
    //周一0点的时间戳
    let mondayTimeEnd = getDayStartAndEnd(mondayTime).startTime;

    // 目标时间   
    let currentData = new Date(time);
    let currentDateJson= timestampToTime(time);
    let str = "周" + "日一二三四五六".charAt(currentData.getDay());
    if(time>mondayTimeEnd && time<sundayTiemEnd){//是本周
        if(type==1){
            return str+' '+isMorningOrAfternoon(time)
        }else if(type==2){
            return str;
        }
    }else{
        return false;
    }
};

/**
 * 判断目标时间是否是昨天
 * @param time
 * @returns {string|boolean}
 */
const isYesterday=function(time,type=1){
    time=time.toString().length===10?time * 1000:time;//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    //前一天的时间戳   
    let yesterdayTime = Date.parse(new Date()) -  24 * 60 * 60 * 1000;
    let yesterdayStart = getDayStartAndEnd(yesterdayTime).startTime;
    let yesterdayEnd = getDayStartAndEnd(yesterdayTime).endTime;

    if(time>yesterdayStart && time<yesterdayEnd){
        if(type==1){
            return '昨天 '+isMorningOrAfternoon(time)
        }else if(type==2){
            return '昨天';
        }
    }else{
        return false;
    }
};

/**
 * 判断目标时间是否是当天
 * @param time
 * @returns {string|boolean}
 */
const isCurrentDay=function(time){
    time=time.toString().length===10?time * 1000:time;//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let currentDate=new Date();
    let dayStart=getDayStartAndEnd(currentDate).startTime;
    let dayEnd=getDayStartAndEnd(currentDate).endTime;
    if(time>dayStart && time<dayEnd){//是当天直接返回时间  例如：上午 10:20
        return isMorningOrAfternoon(time);
    }else{
        return false;
    }
};

const isMorningOrAfternoon=function(time){
    time=timestampToTime(time);
    if(time.h>12){
        return '下午 '+time.h+':'+time.m;
    }else{
        return '上午 '+time.h+':'+time.m;
    }
};

/**
 * 为聊天做的聊天会话时间
 * @param time
 * @returns {*|boolean|string|string|boolean}
 */
const forChatSessionTime=function(time,type=1){
    let currentDay=isCurrentDay(time);
    let yesterday=isYesterday(time,type);
    let currentWeek=isCurrentWeek(time,type);
    if(currentDay){//当天
        return currentDay;
    }else if(yesterday){//昨天
        return yesterday;
    }else if(currentWeek){//本周内
        return currentWeek;
    }else{
        let date=timestampToTime(time);
        if(type==1){
            return date.Y+'-'+date.M+'-'+date.D;
        }else if(type==2){
            return date.Y+'年'+date.M+'月'+date.D+'日 '+isMorningOrAfternoon(time);
        }
    }
};


module.exports = {
    timestampToTime:timestampToTime,
    forChatSessionTime:forChatSessionTime,
    isCurrentWeek:isCurrentWeek,
    isYesterday:isYesterday,
    isCurrentDay:isCurrentDay,
    getDayStartAndEnd:getDayStartAndEnd,
    isMorningOrAfternoon:isMorningOrAfternoon
};
