import {
    observer,
    inject,
} from 'mobx-react';
import React, {
    useState,
} from 'react';
import styles from './CommentBox.styl';
import * as csp from 'js-csp';

export default inject(
    'messagesToServer',
    'token',
)(observer(({
    messagesToServer,
    token,
}: any) => {
    const [value, setValue] = useState(`hello\n`);
    const handleChange = (e: any) => {
        setValue(e.target.value);
    }
    const handleClick = () => {
        csp.putAsync(messagesToServer, {
            token,
            text: value
        });
        setValue('');
    };
    return (
        <div>
            <div
                className={styles.commentBox}
            >
                <div
                    className={styles.textareaBox}
                >
                    <textarea
                        className={styles.textarea}
                        onChange={handleChange}
                        value={value}
                    />
                </div>
                <button
                    className={styles.sendBtn}
                    onClick={handleClick}
                >Send</button>
            </div>
        </div>
    );
}));

