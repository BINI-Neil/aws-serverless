const { DynamoDBClient, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');

// Initialize DynamoDB client
const dynamoDBClient = new DynamoDBClient();

module.exports.updateData = async (event) => {
  const { id } = event.pathParameters; // Get the 'id' from the URL path
  const { name, age } = JSON.parse(event.body); // Get updated values from the request body

  console.log('Updating data for id:', id);

  const params = {
    TableName: process.env.DYNAMO_TABLE,
    Key: {
      id: { N: id }, // Primary key 'id' used for the lookup
    },
    UpdateExpression: 'SET #name = :name, #age = :age, updatedAt = :updatedAt',
    ExpressionAttributeNames: {
      '#name': 'name',  // Use placeholder for attribute names
      '#age': 'age',
    },
    ExpressionAttributeValues: {
      ':name': { S: name },  // Set updated 'name'
      ':age': { N: age.toString() },  // Set updated 'age'
      ':updatedAt': { S: new Date().toISOString() },  // Set updated timestamp
    },
    ReturnValues: 'ALL_NEW',  // Return the updated item
  };

  try {
    const command = new UpdateItemCommand(params);
    const result = await dynamoDBClient.send(command);

    // Check if the item was updated successfully
    if (result.Attributes) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Data updated successfully!',
          updatedItem: result.Attributes,  // Return the updated item
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
    console.error('Error updating data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to update data',
        error: error.message,
      }),
    };
  }
};
