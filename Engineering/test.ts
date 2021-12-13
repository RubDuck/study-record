function getValues<T, K extends keyof T>(person: T, keys: K[]): T[K][] {
    return keys.map(key => person[key]);
}

type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never';