export interface IAuthService {
    generateVerificationToken(userId: string): string;
    generateAccessToken(userId: string, email: string): string;
    sendVerificationLink(email: string, token: string): Promise<void>;
}