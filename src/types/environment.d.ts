export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {

        // openai
        OPENAI_KEY: string

        // db
        DB_URL: string // Full connection string

        // gcf
        CONTEXT_EXTRACTOR_URL: string

        // misc
        ENV: string
        PORT: string
    }
  }
}