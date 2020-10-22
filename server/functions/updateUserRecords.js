import csp from 'js-csp';

export default function(chan, records) {
    const result = csp.chan();
    csp.go(function*() {
        while(true) {
            const {record, done} = yield csp.take(chan);
            records.push(record);
            yield csp.putAsync(result, {record, done});
        }
    });
    return result;
}

