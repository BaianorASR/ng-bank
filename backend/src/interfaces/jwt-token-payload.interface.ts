export interface JwtTokenPayload {
  username: string;
  sub: number;
  iat: number;
  exp: number;
}
