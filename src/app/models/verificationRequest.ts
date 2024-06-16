export interface VerificationRequest {
    uid: string
    user: {
        email: string | undefined
        emailVerified: boolean
        photoURL: string | undefined
    }
    text: string
}