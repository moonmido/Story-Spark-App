package com.Story_Spark.story_spark.User_Auth.Configurations;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KeycloakConfig {

    @Value("${keycloak.client_id}")
    private String client_id;
    @Value("${keycloak.realm}")
    private String realm;
    @Value("${keycloak.server_url}")
    private String server_url;
    @Value("${keycloak.client_secret}")
    private String client_secret;


    @Bean
    public Keycloak keycloak(){
        return KeycloakBuilder.builder()
                .realm(realm)
                .grantType("client_credentials")
                .serverUrl(server_url)
                .clientId(client_id)
                .clientSecret(client_secret)
                .build();
    }



}
