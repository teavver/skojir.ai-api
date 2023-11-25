export {};

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
        CONTEXT_EXTRACTOR_URL: string

        // misc
        ENV: string
        PORT: string
    }
  }
}