import csp from 'js-csp';
import updateUserRecords from './updateUserRecords';
import mobx from 'mobx';

it('update user records', async (done) => {
    const input = csp.chan();
    const records = mobx.observable.array();
    const chan = updateUserRecords(input, records);    
    csp.go(function*() {
        yield csp.put(input, {record: {}});
        yield csp.take(chan);
        expect(records).toHaveLength(1);
        done();
    });
});
