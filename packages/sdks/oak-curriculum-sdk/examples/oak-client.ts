import { createOakClient } from '../src/client';

// Set OAK_API_KEY in your shell before running this example.

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
