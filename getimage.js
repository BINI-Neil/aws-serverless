const { S3Client, GetObjectCommand, GetObjectCommandOutput } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Initialize the S3 client
const s3Client = new S3Client();

module.exports.getImageUrl = async (event) => {
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
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: id,
    });

    // Generate the signed URL with an expiration time (e.g., 1 hour)
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    // Return the signed URL to access the image
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Successfully generated a signed URL for the image in ${bucketName}`,
        imageUrl: signedUrl,  // This URL can be used to view or download the image
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