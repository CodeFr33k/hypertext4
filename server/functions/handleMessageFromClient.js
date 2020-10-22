import csp from 'js-csp';

export default function(
    messagesFromClient,
) {
    const result = csp.chan();
    csp.go(function*() {
        while(true) {
            const msg = yield csp.take(messagesFromClient);
            try {
                const data = JSON.parse(msg);
                const record = {
                    lines: data.text.split('\n'),
                    token: data.token,
                };
                csp.putAsync(result, {record});
            } catch (e) {
                console.log(e);
            }
        }
    });
    return result;
}

