import readFile from './readFile';
import * as csp from 'js-csp';

it('read lines from file', async (done) => {
    csp.go(function*() {
        const lines = yield readFile('/var/lib/hypertext4/abc.caml');
        expect(lines).not.toHaveLength(0);
        done();
    });
});

