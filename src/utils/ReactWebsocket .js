import React, { useRef } from 'react';
import Websocket from 'react-websocket';

export default function ReactWebsocket(props, ref) {
  const { url, onMessage, onOpen, onClose, reconnect, debug } = props;

  return (
    <>
      <Websocket
        url={url}
        onMessage={onMessage}
        onOpen={onOpen}
        onClose={onClose}
        reconnect={reconnect}
        debug={debug}
        ref={(Websocket) => {
          ref = Websocket;
        }}
      />
    </>
  );
}
