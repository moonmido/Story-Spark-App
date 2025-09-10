package com.Story_Spark.story_spark.User_Auth.Services;

import com.Story_Spark.story_spark.User_Auth.Models.MyUser;
import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
public class AuthService {

    @Value("${keycloak.realm}")
    private String realm;

    @Autowired
    private Keycloak keycloak;


    public UsersResource GetAllUsers() {
        return keycloak
                .realm(realm)
                .users();
    }


    public boolean validateEmail(String userId) {
        UserRepresentation representation = GetAllUsers().get(userId).toRepresentation();
        return representation.isEmailVerified();
    }


    public boolean register(MyUser myUser) {
        if (myUser == null) throw new IllegalArgumentException("User object is null");
        if (myUser.getUsername() == null || myUser.getUsername().isEmpty()
                || myUser.getPassword() == null || myUser.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Username or password cannot be empty");
        }

        UserRepresentation userRepresentation = new UserRepresentation();
        userRepresentation.setUsername(myUser.getUsername());
        userRepresentation.setEmail(myUser.getUsername());
        userRepresentation.setFirstName(myUser.getFirstname());
        userRepresentation.setLastName(myUser.getLastname());
        userRepresentation.setEnabled(true);
        userRepresentation.setCreatedTimestamp(new Date().getTime());

        CredentialRepresentation credentialRepresentation = new CredentialRepresentation();
        credentialRepresentation.setTemporary(false);
        credentialRepresentation.setType(CredentialRepresentation.PASSWORD);
        credentialRepresentation.setValue(myUser.getPassword());

        userRepresentation.setCredentials(Collections.singletonList(credentialRepresentation));

        UsersResource usersResource = GetAllUsers();
        Response response = usersResource.create(userRepresentation);

        int status = response.getStatus();

        if (status == 201) {

            String userId = GetAllUsers()
                    .searchByUsername(myUser.getUsername(), true)
                    .get(0)
                    .getId();

            SendEmailVerificationToUser(userId);
            return true;
        } else if (status == 409) {
            // User already exists
            return false;
        } else {
            throw new RuntimeException("Keycloak returned error status: " + status);
        }
    }



    public void deactivateAccount(String userId) {
        if (userId == null || userId.trim().isEmpty()) {
            throw new IllegalArgumentException("User ID cannot be null or empty");
        }

        UsersResource usersResource = GetAllUsers();
        UserResource userResource = usersResource.get(userId);

        if (userResource == null) {
            throw new RuntimeException("User not found with ID: " + userId);
        }

        UserRepresentation representation = userResource.toRepresentation();
        representation.setEnabled(false);

        // مهم: نحدث الـ user في Keycloak
        userResource.update(representation);
    }

    public void SendEmailVerificationToUser(String userId) {
        UsersResource usersResource = GetAllUsers();
        usersResource.get(userId).sendVerifyEmail();
    }

    public boolean ResetPassword(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }

        try {
            UsersResource usersResource = GetAllUsers();

            List<UserRepresentation> users = usersResource.search(email, true);

            if (users.isEmpty()) {
                // User not found
                return false;
            }

            UserRepresentation user = users.get(0);
            String userId = user.getId();

            UserResource userResource = usersResource.get(userId);

            userResource.executeActionsEmail(List.of("UPDATE_PASSWORD"));

            return true;

        } catch (Exception e) {
            System.err.println("Error resetting password for email: " + email + " - " + e.getMessage());
            return false;
        }
    }

    public boolean IsEmailVerified(String userId){
        return keycloak.realm(realm).users()
                .get(userId)
                .toRepresentation()
                .isEmailVerified();
    }


}
