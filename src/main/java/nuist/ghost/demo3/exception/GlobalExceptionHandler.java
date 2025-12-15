package nuist.ghost.demo3.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        // 你这里的 IllegalArgumentException 主要来自重复学号
        return ResponseEntity
                .status(HttpStatus.CONFLICT) // 409
                .body(Map.of(
                        "message", ex.getMessage()
                ));
    }
}
