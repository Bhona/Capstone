import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreatePetsRequest } from '../../requests/CreatePetsRequest'
import { getUserId } from '../../helpers/authHelper'
import { petsAccess } from '../../dataLayer/petsAccess'
import { ApiResponseHelper } from '../../helpers/apiResponseHelper'
import { createLogger } from '../../utils/logger'

const logger = createLogger('pets')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    const newPet: CreatePetsRequest = JSON.parse(event.body)
    
    const authHeader = event.headers['Authorization']
    const userId = getUserId(authHeader)
    logger.info(`create pet for user ${userId} with data ${newPet}`)
    const item = await new petsAccess().createPet(newPet,userId)
    
    return new ApiResponseHelper().generateDataSuccessResponse(201,'item',item)

}
