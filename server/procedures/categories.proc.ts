import { row, rows, empty } from '../config/db';

export function all(): Promise<Array<models.ICategory>> {
    return rows('getCategories');
}

export function update(name:string, id: number) {
    return empty('updateCategory', [name, id]);
}

export function destroy(id: number) {
    return empty('deleteCategory', [id]);
}

export function create(name:string) {
    return row('newCategory', [name]);
}