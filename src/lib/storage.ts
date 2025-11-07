/**
 * Storage utility that provides localStorage fallback when Spark KV is unavailable
 */

const STORAGE_PREFIX = 'chalet-familial:'

export class StorageManager {
  private static instance: StorageManager
  private kvAvailable: boolean | null = null

  private constructor() {}

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager()
    }
    return StorageManager.instance
  }

  /**
   * Check if Spark KV is available
   */
  private async checkKVAvailability(): Promise<boolean> {
    if (this.kvAvailable !== null) {
      return this.kvAvailable
    }

    try {
      // Try to access Spark KV
      if (typeof window !== 'undefined' && window.spark?.kv) {
        await window.spark.kv.get('_health_check')
        this.kvAvailable = true
        return true
      }
    } catch (error) {
      // KV not available
      this.kvAvailable = false
    }
    
    this.kvAvailable = false
    return false
  }

  /**
   * Get value from storage (tries Spark KV first, falls back to localStorage)
   */
  async get<T>(key: string): Promise<T | null> {
    const isKVAvailable = await this.checkKVAvailability()
    
    if (isKVAvailable) {
      try {
        const value = await window.spark.kv.get<T>(key)
        return value ?? null
      } catch (error) {
        console.warn(`Spark KV get failed for key "${key}", falling back to localStorage`, error)
        this.kvAvailable = false
      }
    }

    // Fallback to localStorage
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key)
      if (item === null) return null
      return JSON.parse(item) as T
    } catch (error) {
      console.error(`localStorage get failed for key "${key}"`, error)
      return null
    }
  }

  /**
   * Set value in storage (tries Spark KV first, falls back to localStorage)
   */
  async set<T>(key: string, value: T): Promise<void> {
    const isKVAvailable = await this.checkKVAvailability()
    
    if (isKVAvailable) {
      try {
        await window.spark.kv.set(key, value)
        // Also save to localStorage as backup
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
        return
      } catch (error) {
        console.warn(`Spark KV set failed for key "${key}", falling back to localStorage`, error)
        this.kvAvailable = false
      }
    }

    // Fallback to localStorage
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
    } catch (error) {
      console.error(`localStorage set failed for key "${key}"`, error)
      throw error
    }
  }

  /**
   * Delete value from storage
   */
  async delete(key: string): Promise<void> {
    const isKVAvailable = await this.checkKVAvailability()
    
    if (isKVAvailable) {
      try {
        await window.spark.kv.delete(key)
      } catch (error) {
        console.warn(`Spark KV delete failed for key "${key}"`, error)
        this.kvAvailable = false
      }
    }

    // Also delete from localStorage
    try {
      localStorage.removeItem(STORAGE_PREFIX + key)
    } catch (error) {
      console.error(`localStorage delete failed for key "${key}"`, error)
    }
  }

  /**
   * Get all keys from storage
   */
  async getAllKeys(): Promise<string[]> {
    const isKVAvailable = await this.checkKVAvailability()
    
    if (isKVAvailable) {
      try {
        const keys = await window.spark.kv.getKeys()
        return keys
      } catch (error) {
        console.warn('Spark KV getKeys failed, falling back to localStorage', error)
        this.kvAvailable = false
      }
    }

    // Fallback to localStorage
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keys.push(key.substring(STORAGE_PREFIX.length))
      }
    }
    return keys
  }

  /**
   * Get all key-value pairs from storage
   */
  async getAll(): Promise<Record<string, any>> {
    const keys = await this.getAllKeys()
    const result: Record<string, any> = {}
    
    for (const key of keys) {
      const value = await this.get(key)
      if (value !== null) {
        result[key] = value
      }
    }
    
    return result
  }
}

export const storage = StorageManager.getInstance()
