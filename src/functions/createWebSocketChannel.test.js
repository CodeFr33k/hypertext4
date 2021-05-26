import config from 'store/config';
import csp from '../../github.com/CodeFr33k/js-csp';
import {Server} from 'mock-socket';
import createWebSocketChannel from './createWebSocketChannel';

it('open websocket channel', async function(done) {
    const mockServer = new Server(config.websocketUri);
    const messagesToServer = csp.chan();
    const chan = createWebSocketChannel(messagesToServer);
    csp.go(function*() {
        expect(chan).toBeDefined();
        mockServer.stop(done);
    });
});

it('close websocket channel', async function(done) {
    const mockServer = new Server(config.websocketUri);
    const messagesToServer = csp.chan();
    const chan = createWebSocketChannel(messagesToServer);
    csp.go(function*() {
        mockServer.close();
        const message = yield csp.take(chan);
        expect(message).toBe(csp.CLOSED);
        mockServer.stop(done);
    });
});

it('get message from websocket channel', async function(done) {
    const mockServer = new Server(config.websocketUri);
    const messagesToServer = csp.chan();
    const chan = createWebSocketChannel(messagesToServer);
    const payload = "{}";
    mockServer.on('connection', (socket) => {
        socket.send(payload);
    });
    csp.go(function*() {
        const message = yield csp.take(chan);
        expect(message).toEqual(JSON.parse(payload));
        mockServer.stop(done);
    });
});

