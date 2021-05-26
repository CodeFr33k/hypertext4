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
                let lines = data.text.split('\n');
                lines = lines.filter((line) => line !== '');
                lines = lines.concat([
                    '(`',
                    `\tusername = ${data.username}`,
                    `\ttoken = ${data.token}`,
                    `\tcreated = ${new Date().toISOString()}`,
                    ')',
                    '',
                ]);
                const record = {
                    lines,
                    token: data.token,
                    username: data.username,
                };
                csp.putAsync(result, {record});
            } catch (e) {
                console.log(e);
            }
        }
    });
    return result;
}

