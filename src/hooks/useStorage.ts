import { useState, useEffect, useCallback } from 'react'
import { storage } from '@/lib/storage'

/**
 * Custom hook that provides persistent storage with localStorage fallback
 * Compatible with the useKV API from @github/spark/hooks
 */
export function useStorage<T>(key: string, defaultValue: T): [T, (value: T) => Promise<void>] {
  const [value, setValue] = useState<T>(defaultValue)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load initial value from storage
  useEffect(() => {
    let mounted = true

    const loadValue = async () => {
      try {
        const storedValue = await storage.get<T>(key)
        if (mounted) {
          if (storedValue !== null) {
            setValue(storedValue)
          } else {
            // If no value in storage, save the default value
            await storage.set(key, defaultValue)
            setValue(defaultValue)
          }
          setIsInitialized(true)
        }
      } catch (error) {
        console.error(`Error loading value for key "${key}"`, error)
        if (mounted) {
          setValue(defaultValue)
          setIsInitialized(true)
        }
      }
    }

    loadValue()

    return () => {
      mounted = false
    }
  }, [key]) // Only run when key changes

  // Update value in storage
  const updateValue = useCallback(
    async (newValue: T) => {
      try {
        await storage.set(key, newValue)
        setValue(newValue)
      } catch (error) {
        console.error(`Error updating value for key "${key}"`, error)
        throw error
      }
    },
    [key]
  )

  return [value, updateValue]
}
