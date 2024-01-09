import { IUserBase } from "../interfaces/IUserBase";
import { IMembership } from "../interfaces/IMembership";

export interface AccountInfoResponse extends IUserBase {
    membership?: IMembership
}