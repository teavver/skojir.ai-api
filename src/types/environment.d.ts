declare global {
  namespace NodeJS {
    interface ProcessEnv {

        // openai
        OPENAI_KEY: string

        // db
        DB_URL_PROD: string
        DB_URL_DEV: string
        DB_COLLECTION: string

        // gcf
        BACKEND_URL: string

        // mail
        MAILJET_API_KEY: string
        MAILJET_SECRET_KEY: string

        // jwt
        JWT_SECRET: string
        JWT_REFRESH_SECRET: string

        // misc
        ENV: string
        PORT: string
    }
  }
}