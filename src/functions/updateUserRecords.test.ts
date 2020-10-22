import updateUserRecords from './updateUserRecords';
import {
    observe,
    observable,
} from 'mobx';
import * as csp from 'js-csp';

it('update records', async (done: any) => {
    const records = observable.array();
    observe(records, () => {
        done();
    });
    const messages = csp.chan();
    updateUserRecords(
        messages,
        records
    );    
});
