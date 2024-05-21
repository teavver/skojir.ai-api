import { ServiceResponse } from "../../types/responses/ServiceResponse.js"
import { logger, LogType } from "../../utils/logger.js"
import { Request } from "express"
import { AccountInfoResponse } from "../../types/responses/AccountInfoResponse.js"
import { responseCodes } from "../../utils/responseCodes.js"

const MODULE = "services :: user_services :: accountInfo"

export async function accountInfo(req: Request): Promise<ServiceResponse<AccountInfoResponse>> {
    logger(MODULE, `Get User: ${req.user!.email}`, LogType.SUCCESS)
    const userData: AccountInfoResponse = {
        email: req.user!.email,
    }

    if (req.user?.membershipDetails) {
        userData.membership = {
            userId: undefined,
            isActive: req.user!.membershipDetails.isActive,
            endDate: req.user!.membershipDetails.endDate,
        }
    }

    return {
        err: false,
        data: userData,
        statusCode: responseCodes.SUCCESS,
    }
}
