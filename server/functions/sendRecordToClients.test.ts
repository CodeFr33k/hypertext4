import csp from '../../github.com/CodeFr33k/js-csp';
import sendRecordToClients from './sendRecordToClients.ts';
import {jest} from '@jest/globals'

it('send message to all clients', async (done) => {
    const chan = csp.chan(); 
    const client = {
        send: jest.fn(),
    };
    const clients = [client]; 
    const result = sendRecordToClients(chan, clients);    
    csp.go(function*() {
        const record = {};
        yield csp.put(chan, record);
        yield csp.take(result);
        expect(client.send).toHaveBeenCalled();
        done();
    });
});
