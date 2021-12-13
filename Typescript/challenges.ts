/* -------   this is a simple challenges  -------- */

// Pick
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}

// Readonly
type MyReadyonly<T> = {
  readonly [K in keyof T]: T[K]
}

// TupleToObject (元组转对象)
type TupleToObject<T extends readonly any[]> = {
  [K in T[number]]: K
}

// First of Array
type First<T extends any[]> = T[0] extends T[number] ? T[0] : never;


// Length of Tuple
type Length<T> = T extends any[] ? T['length'] : never;


// Exclude
type MyExclude<T, U> = T extends U ? never : T;


// await
type MyAwait<T extends Promise<any>> = T extends Promise<infer K> ? (K extends Promise<any> ? MyAwait<K> : K) : T;


// if
type MyIf<B extends boolean, T, K> = B extends true ? T : K;


// concat
type MyConcat<T extends any[], K extends any[]> = [...T, ...K];


// includes
type MyInculdes<T extends any[], K extends string> = K extends T[number] ? true : false;


// Parameters
type MyParameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

/* -------   this is medium challenges    ------ */

// return
type MyReturn<T extends (...args: any) => any> = T extends (...args: any) => infer P ? P : never;

// omit
type MyOmit<T, K> = {
  [P in Exclude<keyof T, K> ] : T[P]
}

// readyOnly
type MyReadyOnly<T, K extends keyof T> = Readonly<Pick<T, K>> & Exclude<T, K>

// deepReadyOnly
type NoDeepType = string | number | boolean | null | undefined| symbol | bigint | Function;
type DeepDeadyOnly<T> = {
  [K in keyof T]: T[K] extends NoDeepType ? T[K] : DeepDeadyOnly<T[K]>;
}

// Tuple to union
type TupleToUnion<T extends readonly unknown[]> = T extends [infer P, ...infer M] ? P | TupleToUnion<M> : never;

// Chainable  串联构造
type Chainable<T = {}> = {
  option: <K extends string, V>(key: K, value: V) => Chainable<T & { K: V }>
  get: () => T;
}

// last of array
type LastOfArray<T> = T extends [...any, infer R] ? R : never;

// Pop
type Pop<T extends any[]> = T extends [...infer P, unknown] ? P : never;

// PromiseAll
declare function PromiseAll<T extends readonly any[]>([...T]): Promise<{
  [K in keyof T]: T[K] extends Promise<infer P> ? P : T[K];
}>;