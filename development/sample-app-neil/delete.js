const { DynamoDBClient, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');

// Initialize DynamoDB client
const dynamoDBClient = new DynamoDBClient();

module.exports.deleteData = async (event) => {
  const { id } = event.pathParameters; // Get the 'id' from the URL path

  console.log('Deleting data for id:', id);

  const params = {
    TableName: process.env.DYNAMO_TABLE,
    Key: {
      id: { N: id }, // Primary key 'id' used for the lookup
    },
  };

  try {
    // Execute the DeleteItem command
    const command = new DeleteItemCommand(params);
    const result = await dynamoDBClient.send(command);
    // If the item is deleted, return a success response
    if (result) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: `Item with id ${id} deleted successfully`,
        }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `Item with id ${id} not found`,
        }),
      };
    }
  } catch (error) {
    console.error('Error deleting data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to delete data',
        error: error.message,
      }),
    };
  }
};