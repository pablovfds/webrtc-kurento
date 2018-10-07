package com.pablovfds.webrtc.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.Max;
import javax.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;

@Document
public class Room {

    @Id
    @Size(max=4, min=4)
    private String id;

    private String name;

    private User owner;

    private User creator;

    @DBRef
    private Set<User> participants = new HashSet<>();

    public Room(@Size(max = 4, min = 4) String id, String name, User owner, User creator) {
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.creator = creator;
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

    public Set<User> getParticipants() {
        return participants;
    }

    public void setParticipants(Set<User> participants) {
        this.participants = participants;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }
}
