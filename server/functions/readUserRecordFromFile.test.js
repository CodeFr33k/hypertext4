import readUserRecordFromFile from './readUserRecordFromFile';
import csp from 'js-csp';
import {jest} from '@jest/globals'

it('read user record from file', async (done) => {
    const fs = {
        readFile: jest.fn().mockImplementation(
            (filename, encoding, callback) => 
                callback(
                    undefined, 
                    'abc\n123\n' +
                    '(\`\n' + 
                    '\tcreated = 123-123\n' +
                    ')\n\n' +
                    'def\n'
                ),
        ),
    };
    csp.go(function*() {
        const chan = csp.chan();
        csp.putAsync(
            chan, 
            '/var/lib/hypertext4/user/abc.caml'
        );
        const {record} = yield csp.take(
            readUserRecordFromFile(chan, fs)
        );
        expect(record.created).toEqual('123-123');
        expect(record.lines).toEqual(
            expect.arrayContaining([
                'abc',
                '123',
            ])
        );
        done();
    });
});
