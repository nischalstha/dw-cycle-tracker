/**
 * Safely gets keys from an object, returning an empty array if the object is null or undefined
 */
export function safeObjectKeys<T extends object>(obj: T | null | undefined): (keyof T)[] {
  if (obj === null || obj === undefined) {
    return []
  }
  return Object.keys(obj) as (keyof T)[]
}

/**
 * Safely gets values from an object, returning an empty array if the object is null or undefined
 */
export function safeObjectValues<T extends object>(obj: T | null | undefined): T[keyof T][] {
  if (obj === null || obj === undefined) {
    return []
  }
  return Object.values(obj)
}

/**
 * Safely gets entries from an object, returning an empty array if the object is null or undefined
 */
export function safeObjectEntries<T extends object>(obj: T | null | undefined): [keyof T, T[keyof T]][] {
  if (obj === null || obj === undefined) {
    return []
  }
  return Object.entries(obj) as [keyof T, T[keyof T]][]
}

/**
 * Safely accesses a property from an object, returning a default value if the object or property is null or undefined
 */
export function safeGet<T, K extends keyof T>(obj: T | null | undefined, key: K, defaultValue: T[K]): T[K] {
  if (obj === null || obj === undefined) {
    return defaultValue
  }
  return obj[key] !== undefined ? obj[key] : defaultValue
}

