import * as express from 'express';
import * as passport from 'passport';
import * as session from 'express-session';
let MySQLStore = require('express-mysql-session')(session);
import { Strategy as LocalStrategy } from 'passport-local';
import * as userProc from '../procedures/users.proc';
import { pool } from './db';
import * as utils from '../utils';


export default function configurePassport(app: express.Express) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, done) => {
        userProc.readByEmail(email)
        .then((user) => {
            if (!user) {
                //if the user was not found 
                return done(null, false, { message: 'Invalid login' });
            }
            return utils.checkPassword(password, user.password)
            .then((matches)=> {
                if(matches) {
                    delete user.password;
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid login'});
                }
            }); 
        }, (err) => {
            //there was some kind of error when talking to the db
            return done(err);
        });
}));

    passport.serializeUser((user: models.IUser, done)=> {
        done(null, user.id);
    });
    passport.deserializeUser((id: number, done) => {
        //in here, it's our job to take the id and get the "full" user object
        userProc.read(id)
        .then((user) => {
            //no error encountered, sending Passport the use that came back
            done(null, user);
        }, (err) => {
            done(err);
        });
    });

    let sessionStore = new MySQLStore({
        createDatabaseTable: true
    }, pool);
    app.use(session({
        secret: 'random string!',
        store: sessionStore,
        resave: false, 
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());

}