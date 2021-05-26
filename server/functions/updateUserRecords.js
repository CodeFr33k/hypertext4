import csp from 'js-csp';

export default function(chan, records) {
    const result = csp.chan();
    csp.go(function*() {
        while(true) {
            const record = yield csp.take(chan);
            records.push(record);
            yield csp.putAsync(result, record);
        }
    });
    return result;
}

