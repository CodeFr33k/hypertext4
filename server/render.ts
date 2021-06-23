import React from 'react'
import ReactDOM from 'react-dom/server'
import createHistory from 'history/createMemoryHistory'
import { flushChunkNames } from 'react-universal-component/server'
import flushChunks from 'webpack-flush-chunks'
import App from '../src/components/App'
import loadRecords from '../src/functions/loadRecords';
import readFile from 'github.com/CodeFr33k/camljs2/readFile';
import readRecordFromText from 'github.com/CodeFr33k/camljs2/readRecordFromText.ts';
import csp from 'github.com/CodeFr33k/js-csp';
import {
    observe,
    observable,
} from 'mobx';

export default ({ clientStats }) => async (req: any, res) => {
    const chan = csp.go(function*() {
        const history = createHistory({ initialEntries: [req.path] })
        const chan2 = csp.chan();
        csp.putAsync(chan2, '/var/lib/hypertext4/abc.caml');
        csp.putAsync(chan2, '');
        const records = observable.array();
        yield loadRecords(
            readRecordFromText(
                readFile(chan2)
            ),
            records
        );
        const app = ReactDOM.renderToString(React.createElement(App, {history: history}, null))
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
        <link data-n-head="ssr" rel="icon" type="image/x-icon" href="/favicon.ico">
        <link data-n-head="ssr" rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link data-n-head="ssr" rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">       <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>codefr33k.live</title>
        <script>
            window.recordsFromServer = ${JSON.stringify(records)}
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
        chan2.close();
    });
}
