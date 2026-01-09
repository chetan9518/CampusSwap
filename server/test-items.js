const axios = require('axios');

async function testItems() {
  try {
    // Test without auth first to see if there are any items
    const response = await axios.get('http://localhost:3000/api/v1/items');
    console.log('Items found:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testItems();
