export interface Post {
    id: number;
    userId: number;
    title: string;
    body: string;

    timestamp: Date;
    author: string;

    commentsShowed: boolean;
}