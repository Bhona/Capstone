import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId} from '../../helpers/authHelper'
import { petsAccess } from '../../dataLayer/petsAccess'
import { S3Helper } from '../../helpers/s3Helper'
import { ApiResponseHelper } from '../../helpers/apiResponseHelper'
import { createLogger } from '../../utils/logger'

const s3Helper = new S3Helper()
const apiResponseHelper= new ApiResponseHelper()
const logger = createLogger('pets')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    console.log("EVENT:", event);

    const authHeader = event.headers['Authorization']
    const userId = getUserId(authHeader) 
    logger.info(`get pets for user ${userId}`)
    const result = await new petsAccess().getUserPets(userId)

    for(const record of result){
        record.attachmentUrl = await s3Helper.getPetAttachmentUrl(record.petId)
    }

    return apiResponseHelper.generateDataSuccessResponse(200,'items',result)
}