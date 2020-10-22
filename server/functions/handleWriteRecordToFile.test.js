import csp from 'js-csp';
import handleWriteRecordToFile from './handleWriteRecordToFile';
import {jest} from '@jest/globals'

it('write record to file', async (itDone) => {
    const chan = csp.chan();
    const fs = {
        existsSync: () => true, 
        appendFileSync: jest.fn(),
        writeFileSync: jest.fn(),
    }
    handleWriteRecordToFile(chan, fs);
    const lines = ['abc', ''];
    const record = {
        token: '123',
        lines,
    };
    const done = csp.chan();
    csp.go(function*() {
        yield csp.put(chan, {
            record,
            done,
        });
        yield csp.take(done);
        expect(fs.appendFileSync)
            .toHaveBeenCalledWith(
                expect.anything(),
                'abc',
            );
        itDone();
    });
});

