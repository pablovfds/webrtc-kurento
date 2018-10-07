package com.pablovfds.webrtc.utils;

import com.google.gson.JsonObject;
import com.pablovfds.webrtc.service.UserKMS;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;

import java.io.IOException;

@Component
public class MessageSender {

    public void sendMessage(UserKMS userSession, JsonObject message) throws IOException {
        if(!userSession.getSession().isOpen()) return;
        synchronized (userSession.getSession()) {
            TextMessage msg = new TextMessage(message.toString().getBytes("UTF-8"));
            userSession.getSession().sendMessage(msg);
        }
    }

}
