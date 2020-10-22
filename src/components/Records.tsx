import React from 'react';
import {
    inject,
    observer
} from 'mobx-react';
import styles from './Records.styl';

export default inject('records')(
observer((props: any) => {
    const records = props.records.map((record: any) => (
        <>
            {record.lines.map((line: string, index: number) => (
                <div 
                    key={line+index}
                    className={styles.lineBox}
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

