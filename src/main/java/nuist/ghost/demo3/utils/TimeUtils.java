package nuist.ghost.demo3.utils;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class TimeUtils {

    // 返回当前时间字符串，格式精确到秒（yyyy-MM-dd HH:mm:ss）
    public static String currentTimestamp() {
        DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return LocalDateTime.now().format(FORMATTER);
    }
}
