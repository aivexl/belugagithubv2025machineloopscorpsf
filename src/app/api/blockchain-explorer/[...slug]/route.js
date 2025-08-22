import { EXPLORER_CONFIG, CHAIN_EXPLORER_MAP, EXPLORER_ENDPOINTS } from '../config.js';

export async function GET(request, { params }) {
  const { slug } = await params;
  const path = slug.join('/');

  try {
    // Parse the request path to determine what data to fetch
    const pathParts = path.split('/');
    const action = pathParts[0]; // 'transactions', 'transfers', 'info'
    const address = pathParts[1];
    const chain = pathParts[2] || 'bsc'; // Default to BSC

    if (!address) {
      return Response.json(
        { error: 'Token address is required' },
        { status: 400 }
      );
    }

    // Get the appropriate explorer for the chain
    const explorerName = CHAIN_EXPLORER_MAP[chain.toLowerCase()] || 'BSCScan';
    const explorer = EXPLORER_CONFIG[explorerName];

    if (!explorer) {
      return Response.json(
        { error: `Unsupported chain: ${chain}` },
        { status: 400 }
      );
    }

    console.log(`Using ${explorer.name} for ${chain} chain`);

    // Try multiple actions if the primary one fails
    const actions = [action];
    if (action === 'transfers') actions.push('transactions');
    if (action === 'transactions') actions.push('transfers');

    for (const currentAction of actions) {
      try {
        console.log(`Trying ${explorer.name} for ${currentAction}...`);
        
        let endpoint;
        switch (currentAction) {
          case 'transactions':
            endpoint = EXPLORER_ENDPOINTS.transactions;
            break;
          case 'transfers':
            endpoint = EXPLORER_ENDPOINTS.tokenTransfers;
            break;
          case 'info':
            endpoint = EXPLORER_ENDPOINTS.tokenInfo;
            break;
          default:
            endpoint = EXPLORER_ENDPOINTS.tokenTransfers;
        }

        const url = `${explorer.baseUrl}${endpoint}`
          .replace('{address}', address)
          .replace('{apiKey}', explorer.apiKey);

        console.log(`Making request to: ${url}`);

        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'DuniaCrypto/1.0'
          },
          next: { revalidate: 30 }
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`${explorer.name} response status:`, response.status);
          
          // Check if the API returned an error
          if (data.status === '0' && data.message) {
            console.log(`${explorer.name} API error:`, data.message);
            continue; // Try next action
          }
          
          // Transform the data to a consistent format
          const transformedData = {
            source: explorer.name,
            chain: chain,
            address: address,
            data: data
          };

          // If it's token transfers, transform to our transaction format
          if ((currentAction === 'transfers' || currentAction === 'transactions') && data.result) {
            transformedData.transactions = data.result.map(tx => {
              // Determine transaction type based on from/to addresses
              let transactionType = 'transfer';
              if (currentAction === 'transfers') {
                transactionType = tx.from.toLowerCase() === address.toLowerCase() ? 'sell' : 'buy';
              } else {
                transactionType = tx.from.toLowerCase() === address.toLowerCase() ? 'out' : 'in';
              }

              // Calculate actual token amount based on decimals
              const decimals = parseInt(tx.tokenDecimal) || 18;
              const rawAmount = parseFloat(tx.value) || 0;
              const actualAmount = rawAmount / Math.pow(10, decimals);

              return {
                transaction_hash: tx.hash,
                wallet_address: tx.from,
                transaction_type: transactionType,
                base_token_amount: actualAmount.toFixed(4),
                quote_token_amount: '0', // Will be calculated later
                total_value_usd: '0', // Will be calculated later
                base_token_price_usd: '0', // Will be calculated later
                block_timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
                source: `${explorer.name} (${chain.toUpperCase()})`,
                block_number: tx.blockNumber,
                gas_used: tx.gasUsed,
                gas_price: tx.gasPrice,
                contract_address: tx.contractAddress || address,
                token_name: tx.tokenName,
                token_symbol: tx.tokenSymbol,
                token_decimal: tx.tokenDecimal,
                to_address: tx.to,
                from_address: tx.from,
                nonce: tx.nonce,
                transaction_index: tx.transactionIndex
              };
            });
          }

          return Response.json(transformedData);
        }
      } catch (error) {
        console.log(`${explorer.name} failed for ${currentAction}:`, error.message);
        continue;
      }
    }

    // If all actions failed, try alternative explorers
    const alternativeExplorers = Object.keys(EXPLORER_CONFIG).filter(name => name !== explorerName);
    
    for (const altExplorerName of alternativeExplorers) {
      const altExplorer = EXPLORER_CONFIG[altExplorerName];
      
      try {
        console.log(`Trying alternative explorer ${altExplorer.name}...`);
        
        const endpoint = EXPLORER_ENDPOINTS.tokenTransfers;
        const url = `${altExplorer.baseUrl}${endpoint}`
          .replace('{address}', address)
          .replace('{apiKey}', altExplorer.apiKey);

        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'DuniaCrypto/1.0'
          },
          next: { revalidate: 30 }
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.status === '0' && data.message) {
            console.log(`${altExplorer.name} API error:`, data.message);
            continue;
          }
          
          if (data.result && data.result.length > 0) {
            const transformedData = {
              source: altExplorer.name,
              chain: 'alternative',
              address: address,
              transactions: data.result.map(tx => {
                const decimals = parseInt(tx.tokenDecimal) || 18;
                const rawAmount = parseFloat(tx.value) || 0;
                const actualAmount = rawAmount / Math.pow(10, decimals);

                return {
                  transaction_hash: tx.hash,
                  wallet_address: tx.from,
                  transaction_type: tx.from.toLowerCase() === address.toLowerCase() ? 'sell' : 'buy',
                  base_token_amount: actualAmount.toFixed(4),
                  quote_token_amount: '0',
                  total_value_usd: '0',
                  base_token_price_usd: '0',
                  block_timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
                  source: `${altExplorer.name} (Alternative)`,
                  block_number: tx.blockNumber,
                  gas_used: tx.gasUsed,
                  gas_price: tx.gasPrice,
                  contract_address: tx.contractAddress || address,
                  token_name: tx.tokenName,
                  token_symbol: tx.tokenSymbol,
                  token_decimal: tx.tokenDecimal
                };
              })
            };

            return Response.json(transformedData);
          }
        }
      } catch (error) {
        console.log(`${altExplorer.name} failed:`, error.message);
        continue;
      }
    }

    throw new Error('All blockchain explorers failed');
  } catch (error) {
    console.error('Blockchain explorer error:', error);
    return Response.json(
      { error: 'Failed to fetch blockchain data', details: error.message },
      { status: 500 }
    );
  }
} 