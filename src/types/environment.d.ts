export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {

        // openai
        OPENAI_KEY: string

        // db
        SUPABASE_URL: string
        SUPABASE_KEY: string

        // gcf
        CONTEXT_EXTRACTOR_URL: string

        // misc
        ENV: string
        PORT: string
    }
  }
}