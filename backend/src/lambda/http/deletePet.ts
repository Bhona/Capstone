import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import 'source-map-support/register'

const docClient = new AWS.DynamoDB.DocumentClient()

const petsTable = process.env.PETS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const petId = event.pathParameters.petId
    const params = {
        Bucket: process.env.IMAGES_BUCKET,
        Key: `${petId}.png`
    }

    await docClient.delete({
        TableName: petsTable,
        Key: {
            petId: petId
        }
    }).promise()

    const s3 = new AWS.S3({
        signatureVersion: 'v4'
    })

   try {
        await s3.headObject(params).promise()
        console.log("File Found in S3")
        try {
            await s3.deleteObject(params).promise()
            console.log("file deleted Successfully")
        }
        catch (err) {
            console.log("ERROR in file Deleting : " + JSON.stringify(err))
        }
    } catch (err) {
            console.log("File not Found ERROR : " + err.code)
    }

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: 'Pet removed'
    }
}