import React, {
    useEffect,
} from 'react'
import {
    Provider,
    observer,
} from 'mobx-react';
import { hot } from 'react-hot-loader/root'
import styles from './App.styl'
import CommentBox from 'components/CommentBox';
import Records from 'components/Records';
import UserRecords from 'components/UserRecords';
import records from 'store/records';
import userRecords from 'store/userRecords';
import updateUserRecords from 'functions/updateUserRecords';
import createWebSocketChannel from 'functions/createWebSocketChannel';
import createBackoffWebSocketChannel from 'functions/createBackoffWebSocketChannel';
import fetchUserRecords from 'functions/fetchUserRecords';
import * as csp from 'js-csp';

const messagesToServer = csp.chan();

const App = observer(function(props: any) {
    useEffect(() => {
        const websocket = createBackoffWebSocketChannel(() => {
            return createWebSocketChannel(messagesToServer);
        });
        const http = csp.chan();
        csp.go(function*() {
            const userRecords = yield csp.take(
                fetchUserRecords(fetch)
            );
            for(const userRecord of userRecords) {
                yield csp.put(http, userRecord);
            }
        });
        const chan = csp.operations.merge([websocket, http]);
        updateUserRecords(chan, userRecords);
    }, []);
    return (
        <Provider
            userRecords={userRecords}
            records={records}
            messagesToServer={messagesToServer}
            token={props.token}
        >
            <div className={styles.app}>
                <div className={styles.lhs}>
                    <Records />
                </div>
                <div className={styles.rhs}>
                    <UserRecords />
                    <CommentBox />
                </div>
            </div>
        </Provider>
    );
});

export default hot(App)

