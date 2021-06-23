import 'colors';
import express from 'express';
import WebSocket from 'ws';
import fs from 'fs';
import webpack from 'webpack';
// @ts-ignore
import noFavicon from 'express-no-favicons';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackHotServerMiddleware from 'webpack-hot-server-middleware';
import clientConfig from '../webpack/client.dev.js';
import serverConfig from '../webpack/server.dev.js';
import clientConfigProd from '../webpack/client.prod.js';
import serverConfigProd from '../webpack/server.prod.js';
import sendRecordToClients from './functions/sendRecordToClients.js';
import handleMessageFromClient from './functions/handleMessageFromClient.js';
import handleWriteRecordToFile from './functions/handleWriteRecordToFile.js';
import updateUserRecords from './functions/updateUserRecords.js';
import getFilenamesFromFolder from './functions/getFilenamesFromFolder.js';
//import readUserRecordFromFile from './functions/readUserRecordFromFile.js';
import messagesFromClient from './channels/messagesFromClient.js';
import readRecordFromText from '../github.com/CodeFr33k/camljs2/readRecordFromText.js';
import readFile from '../github.com/CodeFr33k/camljs2/readFile.js';
import csp from '../github.com/CodeFr33k/js-csp/index.js';
import loadRecords from '../src/functions/loadRecords.js';
import http from 'http';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { publicPath } = clientConfig.output
const outputPath = clientConfig.output.path
const DEV = process.env.NODE_ENV === 'development'
const app = express()
app.use(noFavicon())
app.enable('etag');
app.set('etag', 'strong');

let isBuilt = false
const server = http.createServer(app);

const done = () => !isBuilt
  && server.listen(3000, () => {
    isBuilt = true
    console.log('BUILD COMPLETE -- Listening @ http://localhost:3000'.magenta)
  })

let records = [];
app.get('/api/records', (_req, res) => {
    res.send(records);
});

const chan = csp.chan();
csp.putAsync(chan, '/var/lib/hypertext4/abc.caml');

setInterval(function() {
    console.log('reload file');
    records.length = 0;
    csp.putAsync(chan, '/var/lib/hypertext4/abc.caml');
}, 5000);

loadRecords(
    readRecordFromText(
        readFile(chan)
    ),
    records
);

const userRecords = [];

app.get('/api/user/records', (_req, res) => {
    res.send(userRecords);
});

if (DEV) {
  const compiler = webpack([clientConfig as any, serverConfig as any])
  const clientCompiler = compiler.compilers[0]
  const options = { publicPath, stats: { colors: true } }
  const devMiddleware = webpackDevMiddleware(compiler as any, options)

  app.use(devMiddleware)
  app.use(webpackHotMiddleware(clientCompiler))
  app.use(webpackHotServerMiddleware(compiler))

  devMiddleware.waitUntilValid(done)
}
else {
  webpack([clientConfigProd as any, serverConfigProd as any]).run((_err, stats) => {
    const clientStats = (stats as any).toJson().children[0]
    const serverRender = require('../buildServer/main.cjs').default;

    app.use(publicPath, express.static(outputPath))
    app.use(serverRender({ clientStats }))

    done()
  })
}

const wss = new WebSocket.Server({
    server,
    path: '/ws',
});
wss.on('connection', (ws) => {
    console.log('connection');
    ws.on('message', (msg) => {
        csp.putAsync(messagesFromClient, msg);
    });
});

updateUserRecords(
    readRecordFromText(
        readFile(
            getFilenamesFromFolder(
                '/var/lib/hypertext4/user/',
                fs
            ),
        )
    ),
    userRecords,
);

sendRecordToClients(
    updateUserRecords(
        handleWriteRecordToFile(
            handleMessageFromClient(messagesFromClient), 
            fs
        ),
        userRecords,
    ),
    wss.clients
);

