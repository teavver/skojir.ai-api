import { verificationSchema } from "../verificationSchema.js";
import { authUserSchema } from "./authUserSchema.js";

export const authVerificationSchema = verificationSchema.append({
    user: authUserSchema
})