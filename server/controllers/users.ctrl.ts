import * as passport from 'passport';
import * as express from 'express';
import * as procedures from '../procedures/users.proc';
import * as auth from '../middleware/auth.mw';
import * as utils from '../utils';

let router = express.Router();

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err: any, user: models.IUser, info: any) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        if (!user) {
            return res.sendStatus(401);
        }
        req.logIn(user, (err) => {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            else {
                delete user.password;
                return res.send(user);
            }
        });
    })(req, res, next);
});

router.all('*', auth.isLoggedIn);

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(() => {
            req.logOut();
            res.sendStatus(204);
        });
    }
})
router
    .route('/')
    .get( (req, res) => { // actually /api/users/
        procedures.all()
            .then((users) => {
                res.send(users);
            }).catch((err) => {
                console.log(err);
                res.sendStatus(500);
            });
    })

    .post(auth.isAdmin, (req, res) => { /// add back auth.isAdmin
        let u = req.body;
        utils.encryptPassword(u.password)
        .then((hash) => {
             return procedures.create(u.email, hash, u.firstname, u.lastname);
        }).then((id) => {
             res.status(201).send(id);
        }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
    })
    });

router.get('/me', (req, res)=> {
    res.send(req.user);
})

router
    .route('/:id')
    .get( (req, res) => {
        procedures.read(req.params.id)
        .then((user) => {
            res.send(user);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
    })
    .put((req, res) => {
        procedures.update(req.body.firstname, req.body.lastname, req.body.email, req.params.id)
            .then(() => {
                res.sendStatus(204);
            }).catch((err) => {
                console.log(err);
                res.sendStatus(500);
            });
    })
    .delete((req, res) => {
        procedures.destroy(req.params.id)
            .then(() => {
                res.sendStatus(204);
            }).catch((err) => {
                console.log(err);
                res.sendStatus(500);
            });
    })

export default router;