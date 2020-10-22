import React from 'react';
import {
    inject,
    observer
} from 'mobx-react';
import styles from './UserRecords.styl';

export default inject('userRecords')(
observer((props: any) => {
    const records = props.userRecords.map((record: any) => (
        <>
            <div className={styles.lineBox}>
                <div className={styles.username}>
                    anonymous
                </div>
            </div>
            {record.lines.map((line: string, index: number) => (
                <div 
                    className={styles.lineBox}
                    key={line+index}
                >
                    <div className={styles.line}>
                        {line} 
                    </div>
                </div>
            ))}
        </>
    ));
    return (
        <div className={styles.linesComponent}>
            {records}
        </div>
    );
}));

