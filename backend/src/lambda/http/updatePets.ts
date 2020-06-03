import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdatePetsRequest } from '../../requests/UpdatePetsRequest'
import { getUserId } from '../../helpers/authHelper'
import { petsAccess } from '../../dataLayer/petsAccess'
import { ApiResponseHelper } from '../../helpers/apiResponseHelper'
import { createLogger } from '../../utils/logger'

const logger = createLogger('pets')
const petAccess = new petsAccess()
const apiResponseHelper = new ApiResponseHelper()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    const petId = event.pathParameters.petId
    const updatedPet: UpdatePetsRequest = JSON.parse(event.body)
    const authHeader = event.headers['Authorization']
    const userId = getUserId(authHeader)
  
    const item = await petAccess.getPetsById(petId)
  
    if(item.Count == 0){
        logger.error(`user ${userId} requesting update for non exists pet with id ${petId}`)
        return apiResponseHelper.generateErrorResponse(400,'PET not exists')
    } 

    if(item.Items[0].userId !== userId){
        logger.error(`user ${userId} requesting update pet does not belong to his account with id ${petId}`)
        return apiResponseHelper.generateErrorResponse(400,'PET does not belong to authorized user')
    }

    logger.info(`User ${userId} updating pet ${petId} to be ${updatedPet}`)
    await new petsAccess().updatePet(updatedPet,petId)
    return apiResponseHelper.generateEmptySuccessResponse(204, `PET ${petId} updated`)
  
}
