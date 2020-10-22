import * as csp from 'js-csp';
import mobx from 'mobx';
import loadRecords from './loadRecords';

it('load records', async (done) => {
    csp.go(function*() {
        const lines = csp.chan();
        csp.putAsync(lines, ['abc']);
        const records = mobx.observable([]);
        loadRecords(lines, records);
        mobx.observe(records, ({object}) => {
            expect(object).toHaveLength(1);
            done();
        });
    });
});
