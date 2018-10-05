package com.pablovfds.webrtc;

import com.pablovfds.webrtc.handler.RoomHandler;
import org.kurento.client.KurentoClient;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@SpringBootApplication
@EnableWebSocket
public class WebRtcApplication implements WebSocketConfigurer {

    public static void main(String[] args) {
        SpringApplication.run(WebRtcApplication.class, args);
    }

    @Bean
    public UserRegistry registry() {
        return new UserRegistry();
    }

    @Bean
    public RoomManager roomManager() {
        return new RoomManager();
    }

    @Bean
    public RoomHandler groupRoomHandler() {
        return new RoomHandler();
    }

    @Bean
    public KurentoClient kurentoClient() {
        return KurentoClient.create();
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(groupRoomHandler(), "/room").setAllowedOrigins("*");
    }
}
