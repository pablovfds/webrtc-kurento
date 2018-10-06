package com.pablovfds.webrtc.web.rest;

import com.pablovfds.webrtc.domain.User;
import com.pablovfds.webrtc.service.UserService;
import com.pablovfds.webrtc.web.rest.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

@RestController
@RequestMapping("/api/users")
public class UserResource {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity create(@RequestBody UserDTO userDTO) throws URISyntaxException {
        User user = this.userService.create(userDTO);
        return ResponseEntity.created(new URI("/api/users/" + user.getUsername())).body(new UserDTO(user));
    }

    @GetMapping("/{username}")
    public ResponseEntity findUserByUsername(@PathVariable String username) {
        return ResponseEntity.ok(new UserDTO(this.userService.getUserByUsername(username)));
    }

    @GetMapping()
    public ResponseEntity findAll() {
        return ResponseEntity.ok(this.userService.getAll().stream().map(UserDTO::new));
    }
}
