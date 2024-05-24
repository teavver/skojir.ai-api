export { }

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            // openai
            OPENAI_KEY: string

            // db
            DB_URL: string
            DB_COLLECTION_PROD: string
            DB_COLLECTION_DEV: string

            // gcf
            BACKEND_URL: string

            // stripe
            STRIPE_SECRET_KEY: string

            // mail
            MAILJET_API_KEY: string
            MAILJET_SECRET_KEY: string

            // jwt
            JWT_SECRET: string
            JWT_REFRESH_SECRET: string

            // misc
            LOG: int
            ENV: string
            PORT: string

            // github
            GH_WEBHOOK_KEY: string
        }
    }
}
