package com.pablovfds.webrtc.service;

import com.google.gson.JsonObject;
import com.pablovfds.webrtc.domain.MessageConstants;
import com.pablovfds.webrtc.utils.MessageSender;
import org.kurento.client.Continuation;
import org.kurento.client.IceCandidate;
import org.kurento.client.MediaPipeline;
import org.kurento.client.WebRtcEndpoint;
import org.kurento.jsonrpc.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.WebSocketSession;

import java.io.Closeable;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

public class UserKMS implements Closeable {

    private static final Logger log = LoggerFactory.getLogger(UserKMS.class);

    private String username;

    private WebSocketSession session;

    private final MediaPipeline pipeline;

    private final WebRtcEndpoint outgoingMedia;

    private final ConcurrentMap<String, WebRtcEndpoint> incomingMedia = new ConcurrentHashMap<>();

    @Autowired
    private MessageSender messageSender;

    public UserKMS(final WebSocketSession session, MediaPipeline pipeline) {
        this.pipeline = pipeline;
        this.session = session;
        this.outgoingMedia = new WebRtcEndpoint.Builder(pipeline).build();

        this.outgoingMedia.addIceCandidateFoundListener(event -> {
            JsonObject response = new JsonObject();
            response.addProperty(MessageConstants.ID, MessageConstants.ICE_CANDIDATE);
            response.addProperty(MessageConstants.NAME, username);
            response.add(MessageConstants.CANDIDATE, JsonUtils.toJsonObject(event.getCandidate()));
            this.messageSender.sendMessage(this, response);
        });
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public WebSocketSession getSession() {
        return session;
    }

    public void setSession(WebSocketSession session) {
        this.session = session;
    }

    public MediaPipeline getPipeline() {
        return pipeline;
    }

    public WebRtcEndpoint getOutgoingMedia() {
        return outgoingMedia;
    }

    public ConcurrentMap<String, WebRtcEndpoint> getIncomingMedia() {
        return incomingMedia;
    }

    public void receiveVideoFrom(UserKMS sender, String sdpOffer) throws IOException {
        log.info("USER {}: connecting with {} in room", this.username, sender.getUsername());

        log.trace("USER {}: SdpOffer for {} is {}", this.username, sender.getUsername(), sdpOffer);

        final String ipSdpAnswer = this.getEndpointForUser(sender).processOffer(sdpOffer);
        final JsonObject scParams = new JsonObject();
        scParams.addProperty(MessageConstants.ID, MessageConstants.RECEIVE_VIDEO_ANSWER);
        scParams.addProperty(MessageConstants.NAME, sender.getUsername());
        scParams.addProperty(MessageConstants.SDP_ANSWER, ipSdpAnswer);

        log.trace("USER {}: SdpAnswer for {} is {}", this.username, sender.getUsername(), ipSdpAnswer);
        this.messageSender.sendMessage(this, scParams);
        log.debug("gather candidates");
        this.getEndpointForUser(sender).gatherCandidates();
    }

    private WebRtcEndpoint getEndpointForUser(final UserKMS sender) {
        if (sender.getUsername().equals(username)) {
            log.debug("PARTICIPANT {}: configuring loopback", this.username);
            return outgoingMedia;
        }

        log.debug("PARTICIPANT {}: receiving video from {}", this.username, sender.getUsername());

        WebRtcEndpoint incoming = incomingMedia.get(sender.getUsername());
        if (incoming == null) {
            log.debug("PARTICIPANT {}: creating new endpoint for {}", this.username, sender.getUsername());
            incoming = new WebRtcEndpoint.Builder(pipeline).build();

            incoming.addIceCandidateFoundListener(event -> {
                JsonObject response = new JsonObject();
                response.addProperty(MessageConstants.ID, MessageConstants.ICE_CANDIDATE);
                response.addProperty(MessageConstants.NAME, sender.getUsername());
                response.add(MessageConstants.CANDIDATE, JsonUtils.toJsonObject(event.getCandidate()));
                this.messageSender.sendMessage(this, response);
            });

            incomingMedia.put(sender.getUsername(), incoming);
        }

        log.debug("PARTICIPANT {}: obtained endpoint for {}", this.username, sender.getUsername());
        sender.getOutgoingMedia().connect(incoming);

        return incoming;
    }

    public void cancelVideoFrom(final String senderName) {
        log.debug("PARTICIPANT {}: canceling video reception from {}", this.username, senderName);
        final WebRtcEndpoint incoming = incomingMedia.remove(senderName);

        log.debug("PARTICIPANT {}: removing endpoint for {}", this.username, senderName);
        incoming.release(new Continuation<Void>() {
            @Override
            public void onSuccess(Void result) throws Exception {
                log.trace("PARTICIPANT {}: Released successfully incoming EP for {}", UserKMS.this.username, senderName);
            }

            @Override
            public void onError(Throwable cause) throws Exception {
                log.warn("PARTICIPANT {}: Could not release incoming EP for {}", UserKMS.this.username, senderName);
            }
        });
    }

    @Override
    public void close() throws IOException {

    }

    public void addCandidate(IceCandidate candidate, String name) {
        if (this.username.compareTo(name) == 0) {
            outgoingMedia.addIceCandidate(candidate);
        } else {
            WebRtcEndpoint webRtc = incomingMedia.get(name);
            if (webRtc != null) {
                webRtc.addIceCandidate(candidate);
            }
        }
    }

    @Override
    public boolean equals(Object obj) {

        if (this == obj) {
            return true;
        }
        if (!(obj instanceof UserKMS)) {
            return false;
        }
        UserKMS other = (UserKMS) obj;
        return username.equals(other.username);
    }

    /*
     * (non-Javadoc)
     *
     * @see java.lang.Object#hashCode()
     */
    @Override
    public int hashCode() {
        int result = 1;
        result = 31 * result + username.hashCode();
        return result;
    }
}
