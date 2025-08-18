package com.example.demo.WebConfig;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // Allow CORS requests to any path from any origin
                registry.addMapping("/**")
                        .allowedOrigins("*")   // Allow all origins; for production specify your frontend URL here
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*");  // Allow all headers (optional)
            }
        };
    }
}