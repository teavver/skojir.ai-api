export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {

        // openai
        OPENAI_KEY: string

        // db
        DB_URL: string // Full server connection string
        DB_NAME_PROD: string
        DB_NAME_DEV: string
        DB_COLLECTION: string

        // gcf
        CONTEXT_EXTRACTOR_URL: string

        // misc
        ENV: string
        PORT: string
    }
  }
}