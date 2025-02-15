const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');

const dynamoDBClient = new DynamoDBClient();

module.exports.getData = async (event) => {
    const { id } = event.pathParameters;  // Get the 'id' from the URL path
  
    console.log('Getting data for id:', id);  // Log for debugging
  
    const params = {
      TableName: process.env.DYNAMO_TABLE,
      Key: {
        id: { N: id },  // The partition key 'id' must match the table schema
      },
    };
  
    try {
      // Get the item from DynamoDB
      const command = new GetItemCommand(params);
      const data = await dynamoDBClient.send(command);
  
      // If the item is found, return it
      if (data.Item) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            id: data.Item.id.S,
            name: data.Item.name.S,
            age: data.Item.age.N,
            createdAt: data.Item.createdAt.S,
          }),
        };
      } else {
        // If the item is not found, return a 404
        return {
          statusCode: 404,
          body: JSON.stringify({ message: `Item with id ${id} not found` }),
        };
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Failed to retrieve data', error: error.message }),
      };
    }
  };