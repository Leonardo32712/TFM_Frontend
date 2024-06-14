export interface userProfile {
    uid: string
    email: string | null
    emailVerified: boolean
    displayName: string | null;
    photoURL: string | null;
}