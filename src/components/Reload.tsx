import {
    observer,
    inject,
} from 'mobx-react';
import React from 'react';
import styles from './Reload.styl';

export default inject(
    'nextRecords',
    'records',
)(observer(({
    nextRecords,    
    records,
}) => {
    if(nextRecords.length === 0) {
        return false;
    }
    const handleClick = () => {
        records.replace(nextRecords);
        nextRecords.clear();
    };
    return (
        <div className={styles.reload}>
            records have updated
            <button
                className={styles.btnReload}
                onClick={handleClick}
            >
                RELOAD
            </button>
        </div>
    );
}));

