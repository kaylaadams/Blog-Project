import { row, rows, empty } from '../config/db';

export function all(): Promise<Array<models.IPost>> {
    return rows('getAllPosts');
}

export function read(id: number): Promise<models.IPost> {
    return row('getSinglePost', [id]);
}

export function update(title: string, content: string, categoryid: number, id: number) {
    return empty('updatePost', [title, content, categoryid, id]);
}

export function destroy(id: number) {
    return empty('deletePost', [id]);
}

export function create(title: string, content: string, userid: number, categoryid: number) {
    return row('newPost', [title, content, userid, categoryid]);
}