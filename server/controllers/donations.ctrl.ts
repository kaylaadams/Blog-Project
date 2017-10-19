import { Router } from 'express';

import * as stripeService from '../services/stripe.svc';

const router = Router();


router
    .post('/', (req, res) => { // /api/donations
        let amount = Number(req.body.amount);
        stripeService.charge(req.body.token, amount)
            .then((success) => {
                res.sendStatus(204);
            }).catch((err) => {
                console.log(err);
                res.status(400).send(err.message);
            });
    });


export default router;