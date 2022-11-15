export interface IJwtTokenPayload {
  username: string;
  sub: number;
  iat: number;
  exp: number;
}
