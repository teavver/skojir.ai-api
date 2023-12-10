import { userCredentialsSchema } from "../userCredentialsSchema.js";
import { authUserSchema } from "./authUserSchema.js";

export const authUserCredentialsSchema = userCredentialsSchema.append({
    user: authUserSchema
})