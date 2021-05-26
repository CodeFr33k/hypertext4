import csp from '../../github.com/CodeFr33k/js-csp';
import createBackoffWebSocketChannel from './createBackoffWebSocketChannel';
import {jest} from '@jest/globals'

it('reconnect on close', async (done) => {
    const websocketChannel2 = csp.chan();
    const websocketFactory = jest.fn()
        .mockImplementationOnce(() => {
            const c = csp.chan();
            c.close()
            return c;
        })
        .mockImplementationOnce(() => websocketChannel2)

    const chan = createBackoffWebSocketChannel(websocketFactory);
    csp.go(function*() {
        const msg = '123';
        yield csp.put(websocketChannel2, msg);
        const result = yield csp.take(chan);
        expect(result).toBe(msg);
        done();
    });
});

