package com.pablovfds.webrtc.utils;

import com.google.gson.JsonObject;
import com.pablovfds.webrtc.service.UserKMS;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

@Component
public class MessageSender {

    private static final Logger log = LoggerFactory.getLogger(MessageSender.class);


    public void sendMessage(UserKMS userSession, JsonObject message) {
        if(!userSession.getSession().isOpen()) return;
        synchronized (userSession.getSession()) {
            TextMessage msg;
            try {
                msg = new TextMessage(message.toString().getBytes("UTF-8"));
                userSession.getSession().sendMessage(msg);
            } catch (IOException e) {
                log.debug(e.getMessage());
            }
        }
    }

}
