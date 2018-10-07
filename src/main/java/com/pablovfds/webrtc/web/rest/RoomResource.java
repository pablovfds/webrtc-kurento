package com.pablovfds.webrtc.web.rest;

import com.pablovfds.webrtc.service.RoomService;
import com.pablovfds.webrtc.web.rest.dto.JoinRoomDTO;
import com.pablovfds.webrtc.web.rest.dto.RoomDTO;
import com.pablovfds.webrtc.web.rest.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.net.URISyntaxException;

@RestController
@RequestMapping("/api/rooms")
public class RoomResource {

    @Autowired
    private RoomService roomService;

    @PostMapping
    public ResponseEntity createRoom(@RequestBody RoomDTO roomDTO) throws URISyntaxException {

        roomDTO = this.roomService.create(roomDTO);

        return  ResponseEntity.created(new URI("/api/rooms/" + roomDTO.getId())).body(roomDTO);
    }

    @PostMapping("/join")
    public ResponseEntity checkJoinRoom(@RequestBody JoinRoomDTO roomDTO) {
        return ResponseEntity.ok(null);
    }
}
