import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import api from './api';
import configurePassport from './config/passport';
const prerender = require('prerender-node');

let clientPath = path.join(__dirname, '../client');

let app = express();

prerender.set('prerenderToken', process.env.PRERENDER_TOKEN);
// prerender.set('prerenderServiceUrl', 'http://localhost:1337/');

console.log(process.env.MY_VARIABLE);

app.use(prerender);
app.use(express.static(clientPath));
app.use(cookieParser());
app.use(bodyParser.json());
configurePassport(app);
app.use('/api', api);

app.get('*', (req, res, next) => {
    if (isAsset(req.url)) {
        return next(); //call the next route handler
    } else {
        //not a server asset, send back index.html so Angular takes over
        res.sendFile(path.join(clientPath, 'index.html'));
    }
});

app.listen(process.env.PORT || 4000,  () => {
    console.log('listening on port 3000');
});

function isAsset(path: string) {
    let pieces = path.split('/');
    if (pieces.length === 0) {
        return false;
    }
    let last = pieces[pieces.length - 1];
    if (path.indexOf('/api') !== -1 || path.indexOf('/?') !== -1) {
        return true;
    } else if (last.indexOf('.') !== -1) {
        return true;
    } else {
        return false;
    }
}