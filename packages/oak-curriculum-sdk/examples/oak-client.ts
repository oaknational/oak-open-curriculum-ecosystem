import { createOakClient } from '../src/client';

// This will read any .env files in the root directory.
// Because this requires filesystem access it won't work in all environments.
await import('dotenv')
  .then((dotenv) => {
    return dotenv.config();
  })
  .then((parsedKeys) => {
    if (parsedKeys.parsed?.OAK_API_KEY) {
      parsedKeys.parsed.OAK_API_KEY = '*****';
    }

    console.log(`.env parsed, result: ${JSON.stringify(parsedKeys)}`);
  })
  .catch((error: unknown) => {
    console.warn(`Could not read .env file, error: ${String(error)}`);
  });

const apiKey = process.env.OAK_API_KEY;
if (!apiKey) {
  throw new Error('OAK_API_KEY is not set');
}

const client = createOakClient(apiKey);

// This base client uses methods and path strings.
const result = await client.GET('/key-stages');
// For this endpoint, a 200 response returns data; failures throw.
const jsonResult = result.data;

console.log(jsonResult);
