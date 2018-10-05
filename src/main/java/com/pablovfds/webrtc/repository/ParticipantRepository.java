package com.pablovfds.webrtc.repository;

import com.pablovfds.webrtc.domain.Participant;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ParticipantRepository extends MongoRepository<Participant, String> {
}
