import csp from '../../github.com/CodeFr33k/js-csp';
import handleMessageFromClient from './handleMessageFromClient';

it('transform client message to record', async (done) => {
    const payload = {
        text: 'xyz\n123\n',
        token: 'abc',
    };
    const messages = csp.chan();
    const chan = handleMessageFromClient(
        messages, 
    );
    csp.go(function*() {
        const {record} = yield csp.take(chan);
        expect(record.lines).toEqual(expect.arrayContaining([
            'xyz',
            '123',
            '(`',
            '\ttoken = abc',
            ')',
            '',
        ]));
        done();
    });
    csp.putAsync(messages, JSON.stringify(payload));
});

