import csp from '../../github.com/CodeFr33k/js-csp/index.js';

export default function(chan, fs) {
    const result = csp.chan();
    csp.go(function*() {
        while(true) {
            const filename = yield csp.take(chan);
            fs.readFile(filename, 'utf-8', (err, text) => {
                const recordsAsText = text.split('\n\n'); 
                for(const recordAsText of recordsAsText) {
                    if(recordAsText === '') {
                        continue;
                    }
                    const lines = recordAsText.split('\n');
                    const username = /username = (.*)/.exec(recordAsText);
                    const created = /created = (.*)/.exec(recordAsText);
                    const token = /token = (.*)/.exec(recordAsText);
                    const record = {
                        lines,
                        username: username && username[1],
                        created: created && created[1],
                        token: token && token[1],
                    };
                    csp.putAsync(result, {record}); 
                }
            });
        }
    });
    return result;
}

