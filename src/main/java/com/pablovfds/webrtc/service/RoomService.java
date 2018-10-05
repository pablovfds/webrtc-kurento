package com.pablovfds.webrtc.service;

import com.pablovfds.webrtc.repository.RoomRepository;
import com.pablovfds.webrtc.web.rest.dto.RoomDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    public RoomDTO create(RoomDTO roomDTO) {
        return null;
    }
}
