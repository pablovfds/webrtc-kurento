package com.pablovfds.webrtc.web.rest.dto;

import com.pablovfds.webrtc.domain.User;

public class UserDTO {

    private String username;

    private String name;

    public UserDTO(String username, String name) {
        this.username = username;
        this.name = name;
    }

    public UserDTO() {
    }

    public UserDTO(User user) {
        this.name = user.getName();
        this.username = user.getUsername();
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
