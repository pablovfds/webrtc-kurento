package com.pablovfds.webrtc.web.rest;

import com.pablovfds.webrtc.web.rest.dto.RoomDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/room")
public class RoomResource {

    @PostMapping
    public ResponseEntity createRoom(@RequestBody RoomDTO roomDTO) {
        return ResponseEntity.ok(roomDTO);
    }
}
