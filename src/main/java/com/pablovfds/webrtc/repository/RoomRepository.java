package com.pablovfds.webrtc.repository;

import com.pablovfds.webrtc.domain.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoomRepository extends MongoRepository<Room, String> {
}
