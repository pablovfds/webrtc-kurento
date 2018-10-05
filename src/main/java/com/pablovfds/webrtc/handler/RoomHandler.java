package com.pablovfds.webrtc.handler;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.pablovfds.webrtc.Room;
import com.pablovfds.webrtc.RoomManager;
import com.pablovfds.webrtc.UserRegistry;
import com.pablovfds.webrtc.UserSession;
import org.kurento.client.IceCandidate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;

public class RoomHandler extends TextWebSocketHandler {

    private static final Logger log = LoggerFactory.getLogger(RoomHandler.class);

    private static final Gson gson = new GsonBuilder().create();

    @Autowired
    private RoomManager roomManager;

    @Autowired
    private UserRegistry registry;

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        final JsonObject jsonMessage = gson.fromJson(message.getPayload(), JsonObject.class);

        final UserSession user = registry.getBySession(session);

        if (user != null) {
            log.debug("Incoming message from user '{}': {}", user.getName(), jsonMessage);
        } else {
            log.debug("Incoming message from new user: {}", jsonMessage);
        }

        switch (jsonMessage.get("id").getAsString()) {
            case "joinRoom":
                joinRoom(jsonMessage, session);
                break;
            case "receiveVideoFrom":

                final String senderName = jsonMessage.get("sender").getAsString();
                final String participantName = jsonMessage.get("participantName") != null ? jsonMessage.get("participantName").getAsString() : null;
                final UserSession sender = registry.getByName(senderName);
                final UserSession user1 = participantName != null ? registry.getByName(participantName) : user;

                log.info("User: {}", user1.getName());

                final String sdpOffer = jsonMessage.get("sdpOffer").getAsString();
                user1.receiveVideoFrom(sender, sdpOffer);
                break;
            case "leaveRoom":
                leaveRoom(user);
                break;
            case "onIceCandidate":
                JsonObject candidate = jsonMessage.get("candidate").getAsJsonObject();
                final String participantId = jsonMessage.get("participantName") != null ? jsonMessage.get("participantName").getAsString() : null;
                final String candidateName = jsonMessage.get("candidateName").getAsString();
                final UserSession userSession = registry.getByName(participantId);

                if (userSession != null) {
                    IceCandidate cand = new IceCandidate(candidate.get("candidate").getAsString(),
                            candidate.get("sdpMid").getAsString(), candidate.get("sdpMLineIndex").getAsInt());
                    userSession.addCandidate(cand, candidateName);
                }
                break;
            default:
                break;
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
//        UserSession user = registry.removeBySession(session);
//        roomManager.getRoom(user.getRoomName()).leave(user);
    }

    private void joinRoom(JsonObject params, WebSocketSession session) throws IOException {
        final String roomName = params.get("room").getAsString();
        final String name = params.get("name").getAsString();
        log.info("PARTICIPANT {}: trying to join room {}", name, roomName);

        Room room = roomManager.getRoom(roomName);

        if (room == null) {
            log.info("Trying to create room {}", roomName);
            room = roomManager.createRoom(roomName, name, name);
        }

        final UserSession user = room.join(name, session);
        registry.register(user);
    }

    private void leaveRoom(UserSession user) throws IOException {
        final Room room = roomManager.getRoom(user.getRoomName());
        room.leave(user);
        if (room.getParticipants().isEmpty()) {
            roomManager.removeRoom(room);
        }
    }
}
