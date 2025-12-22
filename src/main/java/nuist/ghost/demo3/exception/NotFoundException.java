package nuist.ghost.demo3.exception;
/**
 * @author Chuhang Zhang 张初航
 * @description Global Exception Handler for the application
 *              All of the exception handler classes are defined in this package
 */

public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }
}
