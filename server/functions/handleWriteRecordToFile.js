import csp from 'js-csp';
import path from 'path';

export default function(recordToFile, fs) {
    const result = csp.chan();
    csp.go(function*() {
        while(true) {
            const {record, done} = yield csp.take(recordToFile);
            const file = path.join(
                '/var/lib/hypertext4/user/',
                record.token + '.caml',
            );
            const exists = fs.existsSync(file);
            if(!exists) {
                fs.writeFileSync(file, '');
            }
            for(const line of record.lines) {
                fs.appendFileSync(file, line || '\n\n');
            }
            if(done) {
                csp.putAsync(done);
            }
            csp.putAsync(result, {record, done});
        }
    });
    return result;
}

