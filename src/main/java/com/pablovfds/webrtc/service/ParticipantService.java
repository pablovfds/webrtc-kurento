package com.pablovfds.webrtc.service;

import com.pablovfds.webrtc.repository.ParticipantRepository;
import com.pablovfds.webrtc.web.rest.dto.ParticipantDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ParticipantService {

    @Autowired
    private ParticipantRepository participantRepository;

    public ParticipantDTO create(ParticipantDTO participantDTO) {
        return null;
    }
}
