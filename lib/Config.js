'use strict'

export function getConfig (name, requiredConfig) {
  const config = {}

  for (const key of requiredConfig) {
    const fullKey = name + '_' + key
    const value = process.env[fullKey]

    if (value === undefined) {
      console.error(`[ERROR] ${name} Config Missing: ${fullKey}`)
      return process.exit(1)
    }
    config[key] = value
  }
  return config
}
