import csp from 'js-csp';
import handleMessageFromClient from './handleMessageFromClient';

it('send new record to all clients', async (done) => {
    const payload = {
        text: 'xyz\n123',
        token: 'abc',
    };
    const messages = csp.chan();
    const chan = handleMessageFromClient(
        messages, 
    );
    csp.go(function*() {
        const {record} = yield csp.take(chan);
        expect(record.lines).toHaveLength(2);
        done();
    });
    csp.putAsync(messages, JSON.stringify(payload));
});

