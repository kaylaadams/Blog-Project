import * as express from 'express';
import posts from './controllers/posts.ctrl';
import users from './controllers/users.ctrl';
import categories from './controllers/categories.ctrl';
import donationsCtrl from './controllers/donations.ctrl';



let router = express.Router();

router
    .use('/posts', posts)
    .use('/users', users)
    .use('/categories', categories)
    .use('/donations', donationsCtrl);

export default router;