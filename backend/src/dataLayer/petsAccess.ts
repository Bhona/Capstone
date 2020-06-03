import { petsItem } from '../models/petsItem';
import { CreatePetsRequest } from '../requests/CreatePetsRequest';
import { UpdatePetsRequest } from '../requests/UpdatePetsRequest';
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
// import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)
const uuid = require('uuid/v4')

export class petsAccess{
    constructor(
        private readonly docClient: AWS.DynamoDB.DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly petsTable = process.env.PETS_TABLE,
        private readonly userIdIndex = process.env.USER_ID_INDEX
    ){}

    async getUserPets(userId: string): Promise<petsItem[]>{
        const result = await this.docClient.query({
            TableName: this.petsTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues:{
                ':userId':userId
            }
        }).promise()
        return result.Items as petsItem[]
    }

    async createPet(request: CreatePetsRequest,userId: string): Promise<petsItem>{
        const newId = uuid()
        const item = new petsItem()
        item.userId= userId
        item.petId= newId
        item.createdAt= new Date().toISOString()
        item.name= request.name
        item.description= request.description
        item.dueDate= request.dueDate
        item.done= false
  
        await this.docClient.put({
            TableName: this.petsTable,
            Item: item
        }).promise()

        return item
    }

    async getPetsById(id: string): Promise<AWS.DynamoDB.QueryOutput>{
        return await this.docClient.query({
            TableName: this.petsTable,
            KeyConditionExpression: 'petId = :petId',
            ExpressionAttributeValues:{
                ':petId': id
            }
        }).promise()
    }

    async updatePet(updatedPet: UpdatePetsRequest,petId:string){
        await this.docClient.update({
            TableName: this.petsTable,
            Key:{
                'petId':petId
            },
            UpdateExpression: 'set #namefield = :n, #descriptionfield = :d, dueDate = :dd, done = :done',
            ExpressionAttributeValues: {
                ':n' : updatedPet.name,
                ':d' : updatedPet.description,
                ':dd' : updatedPet.dueDate,
                ':done' : updatedPet.done
            },
            ExpressionAttributeNames:{
                "#namefield": "name",
                "#descriptionfield": "description"
              }
          }).promise()
    }    
}

// function createDynamoDBClient() {
//     console.log('process.env.IS_OFFLINE :' + process.env.IS_OFFLINE);
//     if (process.env.IS_OFFLINE) {
//         console.log('Creating a local DynamoDB instance')
//         return new XAWS.DynamoDB.DocumentClient({
//             region: 'localhost',
//             endpoint: 'http://localhost:8000'
//         })
//     }

//     return new XAWS.DynamoDB.DocumentClient()
// }