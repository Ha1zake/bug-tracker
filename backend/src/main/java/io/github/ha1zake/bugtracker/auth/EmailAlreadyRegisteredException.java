package io.github.ha1zake.bugtracker.auth;

public class EmailAlreadyRegisteredException extends RuntimeException {
    public EmailAlreadyRegisteredException(){
        super("Этот email уже зарегистрирован");
    }
}
