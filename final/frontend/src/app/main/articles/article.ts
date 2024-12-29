export interface Article {
    pid: number;
    date: Date;
    author: string;
    text: string;
    image: string;

    comments: {
        id: number;
        author: string;
        text: string;
    }[];
}