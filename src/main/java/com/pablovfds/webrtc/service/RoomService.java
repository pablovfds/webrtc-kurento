package com.pablovfds.webrtc.service;

import com.pablovfds.webrtc.domain.Room;
import com.pablovfds.webrtc.domain.User;
import com.pablovfds.webrtc.repository.RoomRepository;
import com.pablovfds.webrtc.repository.UserRepository;
import com.pablovfds.webrtc.web.rest.dto.JoinRoomDTO;
import com.pablovfds.webrtc.web.rest.dto.RoomDTO;
import org.apache.commons.lang.RandomStringUtils;
import org.kurento.client.KurentoClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class RoomService {

    private final Logger log = LoggerFactory.getLogger(RoomService.class);

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private KurentoClient kurento;

    private final ConcurrentMap<String, RoomKMS> rooms = new ConcurrentHashMap<>();


    public RoomDTO create(RoomDTO roomDTO) {

        String id = this.generateId();

        Optional<User> optionalCreator = this.userRepository.findById(roomDTO.getOwner().getUsername());

        if (!optionalCreator.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Creator not found.");
        }

        Optional<User> optionalOwner = this.userRepository.findById(roomDTO.getOwner().getUsername());

        if (!optionalOwner.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Owner not found.");
        }

        Room room = new Room(id, roomDTO.getName(), optionalOwner.get(), optionalCreator.get());

        RoomKMS roomKMS = new RoomKMS(id, this.kurento.createMediaPipeline());

        room = this.roomRepository.save(room);

        this.rooms.put(id, roomKMS);

        return new RoomDTO(room);
    }

    public RoomDTO checkJoinRoom(JoinRoomDTO roomDTO) {
        log.debug("Checking join room for user");
        return null;
    }

    private String generateId(){
        String generatedString = RandomStringUtils.randomAlphanumeric(4).toUpperCase();

        Optional<Room> optionalRoom = this.roomRepository.findById(generatedString);

        if (optionalRoom.isPresent()) {
            return generateId();
        }

        return generatedString;
    }
}
