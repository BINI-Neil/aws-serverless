const { S3Client, GetObjectCommand, PutObjectCommand, GetObjectCommandInput, PutObjectCommandInput } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Initialize the S3 client
const s3Client = new S3Client();

module.exports.generateSignedUrl = async (event) => {
  const bucketName = process.env.S3_BUCKET;

  try {
    // Get the query parameter (e.g., image type) to use in the filename
    const fileType = event.queryStringParameters?.fileType || 'image/jpeg'; // Default to 'image/jpeg' if not provided
    const fileName = `uploads/${uuidv4()}.${fileType.split('/')[1]}`;  // Generates a unique filename

    // Define the S3 upload parameters
    const params = {
      Bucket: bucketName,
      Key: fileName,  // The file's key in S3 (filename)
      ContentType: fileType,  // Content type of the file
    };

    // Generate a presigned URL for PUT operation (upload)
    const command = new PutObjectCommand(params);
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });  // URL valid for 1 hour

    // Return the signed URL
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Signed URL generated successfully!',
        signedUrl,
      }),
    };
  } catch (error) {
    console.error('Error generating signed URL', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to generate signed URL',
        error: error.message,
      }),
    };
  }
};
