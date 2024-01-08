import { IUserBase } from "../interfaces/IUserBase";
import { IMembership } from "../interfaces/IMembership";

export interface GetUserResponse extends IUserBase {
    membership?: IMembership
}