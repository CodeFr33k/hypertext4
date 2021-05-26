import config from 'store/config';
import csp from '../../github.com/CodeFr33k/js-csp';

export default function createWebsocketChannel(
    messagesToServer
) {
    const messagesFromServer = csp.chan();
    const websocket = new WebSocket(config.websocketUri); 
    const chan = csp.go(function*() {
        while(true) {
            const msg = yield csp.take(messagesToServer);
            if(chan.isClosed()) {
                yield csp.put(messagesToServer, msg);
                return;
            }
            const payload = JSON.stringify(msg);
            websocket.send(payload);
        }
    });
    websocket.addEventListener('open', () => {
        console.log('websocket open');
    });
    websocket.addEventListener('close', () => {
        console.log('websocket close');
        chan.close();
        messagesFromServer.close();
    });
    websocket.addEventListener('message', (event) => {
        const payload = JSON.parse(event.data);
        csp.putAsync(messagesFromServer, payload);
    });
    return messagesFromServer;
}

