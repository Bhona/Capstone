import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import 'source-map-support/register'

const docClient = new AWS.DynamoDB.DocumentClient()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const petId = event.pathParameters.petId
    const signedUrlExpireSeconds = 60 * 5

    console.log(petId)
    const bucket = process.env.IMAGES_BUCKET
    const petsTable = process.env.PETS_TABLE

    const s3 = new AWS.S3({
        signatureVersion: 'v4'
    })

    const url = s3.getSignedUrl('putObject', {
        Bucket: bucket,
        Key: `${petId}.png`,
        Expires: signedUrlExpireSeconds
    })

    const imageUrl = `https://${bucket}.s3.amazonaws.com/${petId}.png`

    const updateUrlOnPet = {
        TableName: petsTable,
        Key: { "petId": petId },
        UpdateExpression: "set attachmentUrl = :a",
        ExpressionAttributeValues: {
            ":a": imageUrl
        },
        ReturnValues: "UPDATED_NEW"
    }

    await docClient.update(updateUrlOnPet).promise()

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            iamgeUrl: imageUrl,
            uploadUrl: url
        })
    }
}