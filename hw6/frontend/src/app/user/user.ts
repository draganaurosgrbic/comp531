export interface Login {
    username: string;
    password: string;
}

export interface Profile {
    id: number;
    statusHeadline: string;
    image: string;

    username: string;
    displayName: string;
    email: string;
    phone: string;
    birthDate: Date;
    zipcode: string;
    password: string;
}


export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: {
        street: string;
        suite: string;
        city: string;
        zipcode: string;
        geo: {
            lat: string;
            lng: string;
        },
    },
    phone: string;
    website: string;
    company: {
        name: string;
        catchPhrase: string;
        bs: string;
    }
}
