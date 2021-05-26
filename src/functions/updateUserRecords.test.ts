import updateUserRecords from './updateUserRecords';
import {
    observe,
    observable,
} from 'mobx';
import csp from '../../github.com/CodeFr33k/js-csp';

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
    csp.putAsync(messages, 'abc');
});
