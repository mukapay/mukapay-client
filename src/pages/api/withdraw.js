export const prerender = false;

// import { refreshBalance } from '../../stores/user';

export async function POST({ request }) {
    const { proof, amount, to_user_address } = await request.json();
  //   console.log('paymentData:', payment_proof, amount, from_hash, to_hash)
    const payload = {proof, amount, to_user_address}
    console.log('payload-', payload)
  
    try {
  
      const url = 'https://mukapay-api-mainnet.fly.dev/api/withdraw'
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const error = await response.text();
        console.error('Withdraw API error:', error);
        throw new Error(`Withdraw failed with status ${response.status}: ${error}`);
      } else {
        const data = await response.json();
        console.log('data:', data)
        // refreshBalance.set(Date.now());
        return new Response(JSON.stringify(data), {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }

    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to pay' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
} 

