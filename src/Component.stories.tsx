import React from 'react';
import CommentBoxStory from 'components/CommentBox';
import RecordsStory from 'components/Records';
import UserRecordsStory from 'components/UserRecords';
import { Provider } from 'mobx-react';
import * as csp from 'js-csp';

import 'common.styl';

export default {
    title: 'Component',
}

const record = {
    token: '123',
    lines: [
        'abc abc abc',
        'def',
        'light'
    ],
};

const records = [record]; 

export const Records = () => (
    <Provider records={records}>
        <RecordsStory />
    </Provider>
);

export const UserRecords = () => (
    <Provider
        userRecords={records}
    >
        <UserRecordsStory />
    </Provider>
);
const messagesToServer = csp.chan();

export const CommentBox = () => (
    <Provider
        messagesToServer={messagesToServer}
        token="abc"
    >
        <CommentBoxStory
            initialUsername="user123"
        />
    </Provider>
);

