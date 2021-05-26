import {
    observer,
    inject,
} from 'mobx-react';
import React, {
    useState,
} from 'react';
import styles from './CommentBox.styl';
import * as csp from 'js-csp';
import Blockies from 'react-blockies';

export default inject(
    'messagesToServer',
    'token',
)(observer(({
    messagesToServer,
    token,
    initialUsername,
    onUsernameChange,
}: any) => {
    const [username, setUsername] = useState(initialUsername);
    const [value, setValue] = useState(`hello\n`);
    const handleUsernameChange = (e: any) => {
        setUsername(e.target.value);
    }
    const handleChange = (e: any) => {
        const nextValue = e.target.value;
        if(nextValue.slice(-2) === '\n\n') {
            setValue(value);
            return;
        }
        setValue(nextValue);
    }
    const handleClick = () => {
        csp.putAsync(messagesToServer, {
            username,
            token,
            text: value
        });
        onUsernameChange(username);
        setValue('');
    };
    return (
        <div>
            <div
                className={styles.commentBox}
            >
                <div
                    className={styles.identiconBox}
                >
                    <Blockies
                        seed={token}
                        className={styles.identicon}
                    />
                </div>
                <div
                    className={styles.usernameBox}
                >
                    <input
                        className={styles.username}
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </div>
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

