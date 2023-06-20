export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

export type UnwrapPromiseProperties<T> = {
  [K in keyof T]: UnwrapPromise<T[K]>
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
