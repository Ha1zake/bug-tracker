package io.github.ha1zake.bugtracker.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Locale;

public record RegisterRequest(
        @NotBlank(message = "Укажите имя")
        @Size(max = 100, message = "Максимальная длина имени - 100 символов")
        String displayName,

        @NotBlank(message = "Укажите email")
        @Email(message = "Некорректный email")
        @Size(max = 254, message = "Email слишком длинный")
        String email,

        @NotBlank(message = "Укажите пароль")
        @Size(min = 8, max = 128,
                message = "Длина пароля должна быть от 8 символов")
        String password
) {
    public RegisterRequest{
        if (displayName != null){
            displayName = displayName.strip();
        }
        if (email != null){
            email = email.strip().toLowerCase(Locale.ROOT);
        }
    }
}
