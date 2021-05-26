import React from 'react';
import {
    inject,
    observer
} from 'mobx-react';
import Blockies from 'react-blockies';
import styles from './UserRecords.styl';

export default inject(
    'userRecords',
)(
observer((props: any) => {
    const records = props.userRecords.map((record: any) => {
        const lines = [];
        let index: string;
        let line: any;
        for([index, line] of Object.entries(record.lines)) {
            if(line === '(`') {
                lines.push(
                    <div 
                        className={styles.lineBox}
                        key={line+index}
                    >
                        <div className={styles.line}>
                             
                        </div>
                    </div>
                );
                break;
            }
            lines.push(
                <div 
                    className={styles.lineBox}
                    key={line+index}
                >
                    <div className={styles.line}>
                        {line} 
                    </div>
                </div>
            );
        }
        return (
            <>
                <div className={styles.lineBox}>
                    <div
                        className={styles.identiconBox}
                    >
                        <Blockies
                            seed={record.token}
                            className={styles.identicon}
                            scale={3}
                        />
                    </div>
                    <div className={styles.username}>
                        {record.username || 'anonymous'}
                    </div>
                </div>
                {lines}
            </>
        );
    });
    return (
        <div className={styles.linesComponent}>
            {records}
        </div>
    );
}));

