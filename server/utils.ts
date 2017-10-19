import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export function encryptPassword(pw: string): Promise<string> {
    return bcrypt.hash(pw, SALT_ROUNDS);
}

export function checkPassword(pw: string, hash: string): Promise<boolean> {
    return bcrypt.compare(pw, hash);
}