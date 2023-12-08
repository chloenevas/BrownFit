package edu.brown.cs.student.main.handlers;

public class InvalidInputException extends Exception {
    private final Throwable cause;

    public InvalidInputException(String message) {
        super(message);
        this.cause = null;
    }

    public InvalidInputException(String message, Throwable cause) {
        super(message);
        this.cause = cause;
    }
}
