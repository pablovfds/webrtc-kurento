package com.pablovfds.webrtc.service;

import com.pablovfds.webrtc.domain.User;
import com.pablovfds.webrtc.repository.UserRepository;
import com.pablovfds.webrtc.web.rest.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User create(UserDTO userDTO) {

        Optional<User> optionalUser = this.userRepository.findById(userDTO.getUsername());

        if (optionalUser.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already in use.");
        } else {
            return this.userRepository.save(new User(userDTO.getUsername(), userDTO.getName()));
        }
    }

    public User getUserByUsername(String username) {
        Optional<User> optionalUser = this.userRepository.findById(username);

        if (optionalUser.isPresent()) {
            return optionalUser.get();
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found.");
        }
    }

    public List<User> getAll() {
        return this.userRepository.findAll();
    }
}
