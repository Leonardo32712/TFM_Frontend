export interface VerificationRequest {
    requestID: string
    uid: string
    status: string
    user: {
        email: string | undefined
        emailVerified: boolean
        photoURL: string | undefined
    }
    text: string
}