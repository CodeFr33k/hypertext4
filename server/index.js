import 'colors';
import express from 'express';
import WebSocket from 'ws';
import fs from 'fs';
import webpack from 'webpack';
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
import readUserRecordFromFile from './functions/readUserRecordFromFile.js';
import messagesFromClient from './channels/messagesFromClient.js';
import http from 'http';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const csp = require('js-csp');
const { publicPath } = clientConfig.output
const outputPath = clientConfig.output.path
const DEV = process.env.NODE_ENV === 'development'
const app = express()
app.use(noFavicon())

let isBuilt = false
const server = http.createServer(app);

const done = () => !isBuilt
  && server.listen(3000, () => {
    isBuilt = true
    console.log('BUILD COMPLETE -- Listening @ http://localhost:3000'.magenta)
  })

const records = [];

app.get('/api/user/records', (req, res) => {
    res.send(records);
});

if (DEV) {
  const compiler = webpack([clientConfig, serverConfig])
  const clientCompiler = compiler.compilers[0]
  const options = { publicPath, stats: { colors: true } }
  const devMiddleware = webpackDevMiddleware(compiler, options)

  app.use(devMiddleware)
  app.use(webpackHotMiddleware(clientCompiler))
  app.use(webpackHotServerMiddleware(compiler))

  devMiddleware.waitUntilValid(done)
}
else {
  webpack([clientConfigProd, serverConfigProd]).run((err, stats) => {
    const clientStats = stats.toJson().children[0]
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
    readUserRecordFromFile(
        getFilenamesFromFolder(
            '/var/lib/hypertext4/user/',
            fs
        ),
        fs,
    ),
    records,
);

sendRecordToClients(
    updateUserRecords(
        handleWriteRecordToFile(
            handleMessageFromClient(messagesFromClient), 
            fs
        ),
        records,
    ),
    wss.clients
);

