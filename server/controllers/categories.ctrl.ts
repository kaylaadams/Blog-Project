import * as express from 'express';
import { all } from '../procedures/categories.proc';

let router = express.Router();

router.get('/', (req, res) => { // actually /api/categories/
    all()
        .then((categories) => {
            res.send(categories);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

export default router;