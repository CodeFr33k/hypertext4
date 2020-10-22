import csp from 'js-csp';

export default function(chan, fs) {
    const result = csp.chan();
    csp.go(function*() {
        while(true) {
            const filename = yield csp.take(chan);
            fs.readFile(filename, 'utf-8', (err, text) => {
                const recordsAsText = text.split('\n\n'); 
                for(const recordAsText of recordsAsText) {
                    const lines = recordAsText.split('\n');
                    const record = {
                        lines,
                    };
                    csp.putAsync(result, {record}); 
                }
            });
        }
    });
    return result;
}

