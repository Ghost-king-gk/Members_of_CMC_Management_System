package nuist.ghost.demo3.exception;

public class DuplicateStudentIDException extends RuntimeException {
    public DuplicateStudentIDException(String message) {
        super(message);
    }
}