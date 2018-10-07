package com.pablovfds.webrtc.web.rest.dto;

import com.pablovfds.webrtc.domain.Room;

import java.util.Set;
import java.util.stream.Collectors;

public class RoomDTO {
    private String id;
    private String name;
    private UserDTO owner;
    private UserDTO creator;
    private Set<UserDTO> participants;

    public RoomDTO(Room room) {
        this.id = room.getId();
        this.name = room.getName();
        this.owner = new UserDTO(room.getOwner());
        this.creator = new UserDTO(room.getCreator());
        this.participants = room.getParticipants().stream().map(UserDTO::new).collect(Collectors.toSet());
    }

    public RoomDTO() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public UserDTO getOwner() {
        return owner;
    }

    public void setOwner(UserDTO owner) {
        this.owner = owner;
    }

    public UserDTO getCreator() {
        return creator;
    }

    public void setCreator(UserDTO creator) {
        this.creator = creator;
    }

    public Set<UserDTO> getParticipants() {
        return participants;
    }

    public void setParticipants(Set<UserDTO> participants) {
        this.participants = participants;
    }
}
