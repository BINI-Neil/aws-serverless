const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');

// Initialize DynamoDB client
const dynamoDBClient = new DynamoDBClient();



module.exports.insertData = async (event) => {
  const { body } = event;
  const { name, age } = JSON.parse(body);

  // Construct the item to insert into DynamoDB
  const params = {
    TableName: process.env.DYNAMO_TABLE,
    Item: {
      id: { N: Math.random().toString()},
      name: { S: name },
      age: { N: age.toString() },
      createdAt: { S: new Date().toISOString() },
    },
  };

  try {
    // Insert data into DynamoDB
    const command = new PutItemCommand(params);
    await dynamoDBClient.send(command);
    

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Data inserted successfully!' }),
    };
  } catch (error) {
    console.error('Error inserting data', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to insert data', error: error.message }),
    };
  }
};