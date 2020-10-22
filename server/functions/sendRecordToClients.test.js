import csp from 'js-csp';
import sendRecordToClients from './sendRecordToClients.js';
import {jest} from '@jest/globals'

it('send message to all clients', async (done) => {
    const chan = csp.chan(); 
    const client = {
        send: jest.fn(),
    };
    const clients = [client]; 
    sendRecordToClients(chan, clients);    
    csp.go(function*() {
        const payload = {
            record: {},
            done: csp.chan(),
        };
        yield csp.put(chan, payload);
        yield csp.take(payload.done);
        expect(client.send).toHaveBeenCalled();
        done();
    });
});
