import * as express from 'express';
import * as procedures from '../procedures/posts.proc';

let router = express.Router();

router.route('/') //actually /api/chirps
    .get((req, res) => {
        procedures.all()
            .then((posts) => {
                res.send(posts);
            }).catch((err) => {
                console.log(err);
                res.sendStatus(500);
            });
    })
    .post((req, res) => {
        let newPost = req.body
        procedures.create(newPost.title, newPost.content,  newPost.userid, newPost.categoryid)
            .then((id) => {
                res.status(201).send(id);
            }).catch((err) => {
                console.log(err);
                res.sendStatus(500);
            });
    });

router.route('/:id') //actually /api/chirps/:id
    .get((req, res) => {
        procedures.read(req.params.id)
            .then((post) => {
                res.send(post);
            }).catch((err) => {
                console.log(err);
                res.sendStatus(500);
            });
    })
    .put((req, res) => {
        procedures.update(req.body.title, req.body.content, req.body.categoryid, req.params.id)
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