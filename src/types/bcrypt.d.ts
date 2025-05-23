declare module 'bcrypt' {
    export function hash(password: string, saltRounds: number): Promise<string>;
    export function compare(password: string, hash: string): Promise<boolean>;
  }
  