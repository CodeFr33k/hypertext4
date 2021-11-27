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
import Reload from 'components/Reload';
import records from 'store/records';
import imageRecords from 'store/imageRecords';
import userRecords from 'store/userRecords';
import updateUserRecords from 'functions/updateUserRecords';
import createWebSocketChannel from 'functions/createWebSocketChannel';
import createBackoffWebSocketChannel from 'functions/createBackoffWebSocketChannel';
import fetchUserRecords from 'functions/fetchUserRecords';
import fetchRecords from 'functions/fetchRecords';
import * as csp from 'js-csp';
import {observable} from 'mobx';

const messagesToServer = csp.chan();
const nextRecords = observable.array();
let prevHash; 

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
            const sortedRecords = userRecords.sort((a: any, b: any) => 
                (a.created < b.created) ? -1 : 
                ((a.created > b.created) ? 1 : 0)
            );
            for(const userRecord of sortedRecords) {
                yield csp.put(http, userRecord);
            }
            // call to flush initial status 200 response
            const result = fetchRecords(fetch);
            const [nextHash] = yield csp.take(result);
            prevHash = nextHash;
        });
        const chan = csp.operations.merge([websocket, http]);
        updateUserRecords(chan, userRecords);
        setInterval(function() {
            csp.go(function*() {
                const result = fetchRecords(fetch);
                const [nextHash, nextRecordsTmp] = yield csp.take(result);
                if(prevHash === nextHash) {
                    return;
                } 
                prevHash = nextHash;
                nextRecords.clear();
                nextRecords.replace(nextRecordsTmp);
            });
        }, 2000);
    }, []);

    return (
        <Provider
            userRecords={userRecords}
            messagesToServer={messagesToServer}
            records={records}
            token={props.token}
            nextRecords={nextRecords}
        >
            <div className={styles.app}>
                <div className={styles.lhs}>
                    <Reload />
                    <div className={styles.records}>
                        <div className={styles.wordRecords}>
                            <Records records={records} />
                        </div>
                        <div className={styles.imageRecords}>
                            <Records records={imageRecords} />
                        </div>
                    </div>
                </div>
                <div className={styles.rhs}>
                    <UserRecords />
                    <CommentBox
                        onUsernameChange={props.onUsernameChange}
                        initialUsername={props.initialUsername}
                    />
                </div>
            </div>
        </Provider>
    );
});

export default hot(App)

