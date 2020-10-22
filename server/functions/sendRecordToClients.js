import csp from 'js-csp';

export default function(chan, clients) {
    const result = csp.chan();
    csp.go(function*() {
        while(true) {
            const {record, done} = yield csp.take(chan);
            for(let client of clients) {
                client.send(JSON.stringify(record));
            }
            if(done) {
                csp.putAsync(done);
            }
            csp.putAsync(result, {record, done});
        }
    });
    return result;
}

