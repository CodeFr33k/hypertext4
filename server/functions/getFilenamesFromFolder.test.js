import getFilenamesFromFolder from './getFilenamesFromFolder';
import csp from 'js-csp';
import {jest} from '@jest/globals'

it('get filenames from folder', async (done) => {
    const folder = '/var/lib/hypertext4/user/';
    const fs = {
        readdir: jest.fn().mockImplementation(
            (folder, callback) => callback(undefined, [
                'abc.caml',
            ]),
        ),
    };
    csp.go(function*() {
        const chan = getFilenamesFromFolder(
            folder,
            fs,
        );
        const filenames = yield csp.take(chan);
        expect(filenames).toContain(folder+'abc.caml');
        done();
    });
});
