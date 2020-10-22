import React from 'react'
import ReactDOM from 'react-dom/server'
import createHistory from 'history/createMemoryHistory'
import { flushChunkNames } from 'react-universal-component/server'
import flushChunks from 'webpack-flush-chunks'
import App from '../src/components/App'
import loadRecords from '../src/functions/loadRecords';
import readFile from '../src/functions/readFile';
import records from '../src/store/records';
import * as csp from 'js-csp';
import {
    observe,
} from 'mobx';

export default ({ clientStats }) => async (req, res) => {
    const chan = csp.go(function*() {
        const history = createHistory({ initialEntries: [req.path] })
        loadRecords(
            readFile('/var/lib/hypertext4/abc.caml'),
            records
        );
        const disposer = observe(records, ({object}) => {
            const app = ReactDOM.renderToString(<App history={history} blah={records} />)
            const chunkNames = flushChunkNames()
            const {
                js, styles, scripts, stylesheets
            } = flushChunks(clientStats, {
                chunkNames
            })
            console.log('PATH', req.path)
            console.log('DYNAMIC CHUNK NAMES RENDERED', chunkNames)
            console.log('SCRIPTS SERVED', scripts)
            console.log('STYLESHEETS SERVED', stylesheets)
            res.send(
            `<!doctype html>
            <html>
            <head>
            <meta charset="utf-8">
            <title>hypertext4</title>
            <script>
                window.recordsFromServer = ${JSON.stringify(object)}
            </script>
            ${styles}
            </head>
            <body>
            <div id="root" style="height: 100%;">${app}</div>
            </body>
            ${js}
            </html>`
            );
            chan.close();
            disposer();
        });
    });
}
