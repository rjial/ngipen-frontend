export interface UserClaimData {
    email: string,
    name: string,
    address: string,
    level: string
}

export interface UserClaim {
    sub: string,
    iat: number,
    exp: number,
    data: UserClaimData
}