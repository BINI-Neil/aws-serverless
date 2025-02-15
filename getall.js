const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb');

// Initialize DynamoDB client
const dynamoDBClient = new DynamoDBClient();

module.exports.getAlldata = async (event) => {
  const params = {
    TableName: process.env.DYNAMO_TABLE,
  };

  try {
    // Execute the Scan operation to retrieve all items
    const command = new ScanCommand(params);
    const data = await dynamoDBClient.send(command);

    // If there are items in the table, return them
    if (data.Items && data.Items.length > 0) {
      // Map the data to a more usable format for response
      const items = data.Items.map(item => ({
        id: item.id.N,
        name: item.name.S,
        age: item.age.N,
        createdAt: item.createdAt.S,
      }));

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'All items retrieved successfully!',
          items: items, // Return all items
        }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'No items found',
        }),
      };
    }
  } catch (error) {
    console.error('Error retrieving all data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to retrieve data',
        error: error.message,
      }),
    };
  }
};
