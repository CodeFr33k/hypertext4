import csp from '../../github.com/CodeFr33k/js-csp/index.js';

export default function(chan: any, clients: any) {
    const result = csp.chan();
    csp.go(function*() {
        while(true) {
            const record = yield csp.take(chan);
            for(let client of clients) {
                client.send(JSON.stringify(record));
            }
            csp.putAsync(result, record);
        }
    });
    return result;
}

