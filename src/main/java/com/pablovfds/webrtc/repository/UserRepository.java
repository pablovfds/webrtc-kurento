package com.pablovfds.webrtc.repository;

import com.pablovfds.webrtc.domain.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
}
