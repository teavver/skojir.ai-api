import { IUserBase } from "../express/interfaces/IUserBase";
import { IMembership } from "../express/interfaces/IMembership";

export interface GetUserResponse extends IUserBase {
    membership?: IMembership
}