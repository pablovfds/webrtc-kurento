package com.pablovfds.webrtc.service;

import com.pablovfds.webrtc.RoomManager;
import com.pablovfds.webrtc.repository.RoomRepository;
import com.pablovfds.webrtc.web.rest.dto.RoomDTO;
import org.kurento.client.KurentoClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoomService {

    private final Logger log = LoggerFactory.getLogger(RoomService.class);

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private KurentoClient kurento;

    public RoomDTO create(RoomDTO roomDTO) {
        return null;
    }
}
