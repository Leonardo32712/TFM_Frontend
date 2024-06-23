interface Genre {
    id: number
    name: string
}

export interface Movie {
    budget: number
    genres: Genre[]
    id: number
    overview: string
    poster_path: string | null
    release_date: string
    revenue: number
    runtime: number
    status: string
    title: string
}
