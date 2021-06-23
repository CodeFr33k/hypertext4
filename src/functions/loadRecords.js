import csp from '../../github.com/CodeFr33k/js-csp/index.js';

export default function(chan, records) {
    const chan2 = csp.go(function*() {
        while(true) {
            const record = yield csp.take(chan);
            if(record === csp.CLOSED) {
                chan2.close();
                return;
            }
            records.push(record);
        }
    });
    return chan2;
}
