import * as csp from 'js-csp';

export default function(chan, records) {
    const chan2 = csp.go(function*() {
        const lines = yield csp.take(chan);
        if(lines === csp.CLOSED) {
            chan2.close();
            return;
        }
        const record = {
            lines,
        };
        records.replace([record]);
    });
}
