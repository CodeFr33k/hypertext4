import * as csp from 'js-csp';

export default function(
    messages: any,
    records: any,
) {
    csp.go(function*() {
        while(true) {
            const message = yield csp.take(messages);
            records.unshift(message);
        }
    });
}

