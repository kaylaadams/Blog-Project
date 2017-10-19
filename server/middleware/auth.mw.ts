import { Request, Response, NextFunction } from 'express';

export function isLoggedIn( req: Request, res: Response, next: NextFunction) {
    if(req.user) {
        //if req.user has been set
        //req.user is set by passport when a valid session is detected
        //Passsport calls deserializeUser based on the serialized id from the express
        //when the deserialize function returns the 'full' user object, Passport sets req.user
        next();
    } 
    else {
        res.sendStatus(401);
    }
}
export function isAdmin(req: Request, res: Response, next: NextFunction) {
    if(req.user.role ==='admin') {
        next();
    }
    else {
        res.sendStatus(403);
    }
}