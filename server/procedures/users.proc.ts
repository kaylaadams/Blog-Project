import { row, rows, empty } from '../config/db';

export function readByEmail(email: string): Promise<models.IUser> {
    return row('GetUserByEmail', [email]);
}

export function all(): Promise<Array<models.IUser>> {
    return rows('GetUsers');
}

export function read(id: number): Promise<models.IUser> {
    return row('GetUser', [id]);
}
export function destroy(id: number) {
    return empty('deleteUser', [id]);
}

export function update(id: number, firstname: string, lastname: string, email: string, ) {
    return empty('updateUser', [ id, firstname, lastname, email]);
}
export function create(email:string, hash: string, firstname: string, lastname: string) {
    return row('newUser', [ firstname, lastname, email, hash,]);
}