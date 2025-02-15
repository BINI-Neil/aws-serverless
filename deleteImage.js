const { S3Client, GetObjectCommand, GetObjectCommandOutput,DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Initialize the S3 client
const s3Client = new S3Client();

module.exports.deleteImagefile= async (event) => {
  // Extract the S3 bucket name and object key (image file name)
  const bucketName = process.env.S3_BUCKET 
  const  id = event.queryStringParameters?.id;

  if (!bucketName || !id) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Bucket name and id are required.',
      }),
    };
  }

  try {
    // Create the command to retrieve the object from S3
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: id,
    });
    await s3Client.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Successfully deleted the image in ${bucketName}`,
       // This URL can be used to view or download the image
      }),
    };
  } catch (error) {
    console.error('Error retrieving image from S3', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to retrieve image from S3',
        error: error.message,
      }),
    };
  }
};