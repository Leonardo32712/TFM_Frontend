export interface Review {
    uid: string
    username: string
    photoURL: string
    score: number
    review: string
}

export interface ReviewWithMovieID {
    movieId: number
    uid: string
    username: string
    photoURL: string
    score: number
    review: string
}