export interface CustomError extends Error {
    originalError?: any;
}