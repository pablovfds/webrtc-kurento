package com.pablovfds.webrtc.service;

import com.pablovfds.webrtc.UserSession;
import com.pablovfds.webrtc.domain.User;
import org.kurento.client.MediaPipeline;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PreDestroy;
import java.io.Closeable;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

public class RoomKMS implements Closeable {

    private final Logger log = LoggerFactory.getLogger(RoomKMS.class);

    private final ConcurrentMap<String, User> participants = new ConcurrentHashMap<>();

    private final MediaPipeline pipeline;

    public RoomKMS(MediaPipeline pipeline) {
        this.pipeline = pipeline;
    }

    @PreDestroy
    private void shutdown() {
        this.close();
    }

    @Override
    public void close() {

    }
}
