// Import the AWS SDK to interact with DynamoDB (if needed)
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Lambda function handler
module.exports.hello = async (event) => {
  // Log the event for debugging
  console.log('Event received:', event);

  // You can interact with DynamoDB if needed
  // For example, getting an item from the DynamoDB table.
  const params = {
    TableName: process.env.DYNAMO_TABLE, // sample-db-1
    Key: { id: 'sample-id' } // Replace with a key you want to fetch
  };

  try {
    // If you wanted to fetch something from DynamoDB, you can do it here
    const data = await dynamoDb.get(params).promise();
    console.log('DynamoDB response:', data);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Hello, world!',
        data: data.Item, // Or other relevant data from DynamoDB
      }),
    };
  } catch (error) {
    console.error('Error fetching data from DynamoDB:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};