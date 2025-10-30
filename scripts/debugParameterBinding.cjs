// Script untuk debug parameter binding
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qaofdbqx',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-07-22'
});

async function debugParameterBinding() {
  try {
    // Test simple query with parameter
    const simpleQuery = '*[_type == "article" && source == $source] { _id, title }';
    const simpleResult = await client.fetch(simpleQuery, { source: 'Dunia Crypto' });
    console.log('Simple query results:', simpleResult.length);

    // Test coin tags query with parameter
    const coinQuery = '*[_type == "coinTag" && symbol == $symbol] { _id, name, symbol }';
    const coinResult = await client.fetch(coinQuery, { symbol: 'BTC' });
    console.log('Coin query results:', coinResult);

    // Test complex query step by step
    console.log('Testing step by step...');

    // Step 1: Check if articles have coin tags
    const step1Query = '*[_type == "article" && source == "Dunia Crypto" && count(coinTags[]->) > 0] { _id, title }';
    const step1Result = await client.fetch(step1Query);
    console.log('Step 1 - Articles with coin tags:', step1Result.length);

    // Step 2: Check coin tags with BTC symbol
    const step2Query = '*[_type == "coinTag" && symbol == "BTC"] { _id, name, symbol }';
    const step2Result = await client.fetch(step2Query);
    console.log('Step 2 - BTC coin tags:', step2Result);

    // Step 3: Test the problematic query
    const step3Query = '*[_type == "article" && source == "Dunia Crypto" && count(coinTags[]->) > 0 && count(coinTags[]->[symbol == $coinSymbol]) > 0] { _id, title }';
    const step3Result = await client.fetch(step3Query, { coinSymbol: 'BTC' });
    console.log('Step 3 - Complex query results:', step3Result.length);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugParameterBinding();





