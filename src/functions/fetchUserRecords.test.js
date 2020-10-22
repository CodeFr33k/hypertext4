import fetchUserRecords from './fetchUserRecords';
import * as csp from 'js-csp';
import {jest} from '@jest/globals'

it('fetch user records', async (done) => {
    const fetch = jest.fn().mockImplementation(() => Promise.resolve({
        json: () => [],
    }));
    const chan = fetchUserRecords(fetch);
    csp.go(function*() {
        yield csp.take(chan);
        expect(fetch).toHaveBeenCalledWith(
            '/api/user/records',
        );
        done();
    });
});
