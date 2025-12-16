package nuist.ghost.demo3.exception;

public class DuplicateStudentIdException extends RuntimeException {
    public DuplicateStudentIdException(String message) {
        super(message);
    }
}