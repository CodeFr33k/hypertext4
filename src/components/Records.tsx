import React from 'react';
import {
    inject,
    observer
} from 'mobx-react';
import styles from './Records.styl';

export default inject('records')(
observer((props: any) => {
    const records = props.records.map((record: any) => {
        if(record.image) {
            return (
                <>
                    <div 
                        key={record.image}
                        className={styles.imageBox}
                    >
                        <img width="400px" src={record.image} />
                    </div>
                    <div 
                        className={styles.lineBox}
                    />
                </>
            );
        }
        return (
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
        )
    });
    return (
        <div className={styles.linesComponent}>
            {records}
        </div>
    );
}));

