// cache.js
import redis from "../redisClient.js";

/**
 * Caches the result of an asynchronous function.
 *
 * @param {string} key - The cache key.
 * @param {Function} fetchFunction - The asynchronous function to fetch data.
 * @param {number} ttl - Time to live in seconds.
 * @returns {Promise<any>} - The cached or fetched data.
 */
export const cacheFetch = async (key, fetchFunction, ttl = 300) => {
  try {
    // Attempt to retrieve data from cache
    const cachedData = await redis.get(key);
    if (cachedData) {
      console.log(`Cache hit for key: ${key}`);
      try {
        return JSON.parse(cachedData);
      } catch (parseError) {
        console.error(`Error parsing cached data for key ${key}:`, parseError);
        // If parsing fails, proceed to fetch fresh data
      }
    }

    // If not in cache or parsing failed, fetch from DB
    console.log(`Cache miss for key: ${key}. Fetching from DB...`);
    const data = await fetchFunction();

    // Ensure data is a plain object before stringifying
    if (typeof data === 'object') {
      const stringifiedData = JSON.stringify(data);
      console.log(`Storing data in cache for key: ${key}`);
      await redis.set(key, stringifiedData, { ex: ttl });
    } else {
      console.warn(`Data for key ${key} is not an object. Storing as string.`);
      await redis.set(key, data.toString(), { ex: ttl });
    }

    return data;
  } catch (error) {
    console.error(`Error in cacheFetch for key ${key}:`, error);
    // Fallback to fetching from DB if cache fails
    return await fetchFunction();
  }
};
