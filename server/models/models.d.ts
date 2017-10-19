declare namespace models {
    //this is an interface it identifies how the database information should appear
    interface IUser {
        id: number;
        email: string;
        password: string;
        firstname: string;
        lastname: string;
        role: string;
    }

    interface IPost {
        id: number;
        title: string;
        userid: number;
        categoryid: number;
        content: string;
        createdAt: Date;

        authorfirstname?: string;
        authorlastname?: string;
        categoryname?: string;
    }
    interface ICategory {
        id: number;
        name: string;
    }
}