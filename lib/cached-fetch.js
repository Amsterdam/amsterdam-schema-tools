const axios = require('axios')
const levelup = require('level')
const ttl = require('level-ttl')

const db = ttl(levelup('./cache'), {
  defaultTTL: 60 * 60 * 1000 * 24 * 30 // 30 days
})

module.exports = async function (url) {
  try {
    const cached = await db.get(url)
    return JSON.parse(cached)
  } catch (err) {
    // Nothing found in cache! Let's fetch it!
  }

  try {
    const response = await axios.get(url)
    const data = response.data

    await db.put(url, JSON.stringify(data))

    return data
  } catch (err) {
    throw new Error(`Can't fetch ${url}: ${err.message}`)
  }
}
