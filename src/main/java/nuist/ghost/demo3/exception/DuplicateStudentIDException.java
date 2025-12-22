package nuist.ghost.demo3.exception;
/**
 * @author Chuhang Zhang 张初航
 * @description Global Exception Handler for the application
 *              All of the exception handler classes are defined in this package
 */

public class DuplicateStudentIDException extends RuntimeException {
    public DuplicateStudentIDException(String message) {
        super(message);
    }
}