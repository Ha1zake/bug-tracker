package io.github.ha1zake.bugtracker.auth;

import io.github.ha1zake.bugtracker.user.UserRepository;
import jakarta.servlet.DispatcherType;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.SecurityFilterChain;

import java.util.Locale;

@Configuration
public class SecurityConfig {
    @Bean
    public UserDetailsService userDetailsService(UserRepository users) {
        return submittedEmail -> {
            String email = submittedEmail.strip().toLowerCase(Locale.ROOT);
            var account = users.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));
            return User.withUsername(account.getEmail())
                    .password(account.getPasswordHash())
                    .authorities("ACCOUNT")
                    .build();
        };
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        http.authorizeHttpRequests(auth -> auth
                .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()
                .requestMatchers(HttpMethod.GET, "/api/auth/csrf").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/register", "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.GET,
                        "/", "/index.html", "/register.html", "/login.html",
                        "/css/**", "/js/**", "/images/**", "/favicon.ico")
                .permitAll()
                .anyRequest().authenticated()
        )
                .exceptionHandling(errors -> errors
                        .authenticationEntryPoint((request, response, exception) ->
                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED))
                )
                .requestCache(AbstractHttpConfigurer::disable)
                .formLogin(login -> login
                        .loginPage("/login.html")
                        .loginProcessingUrl("/api/auth/login")
                        .usernameParameter("email")
                        .successHandler((request, response, authentication) ->
                        response.setStatus(HttpServletResponse.SC_NO_CONTENT))
                        .failureHandler((request, response, exception) ->
                                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED))
                )
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .logoutSuccessHandler((request, response, authentication) ->
                                response.setStatus(HttpServletResponse.SC_NO_CONTENT))
                );
        return http.build();
    }
}
