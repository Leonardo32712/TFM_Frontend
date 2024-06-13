import { Review } from "./review"

export interface AllReviews {
    spectators: Record<string, Review>
    critics: Record<string, Review>
}