declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DEBUG_MODE: number,
            OPENAI_API_KEY: string,
            OPEN_AI_ORG_ID: string,
            OPEN_AI_PROJ_ID: string,
            MONGO_CONN_STRING: string,
            PORT: number,
            ADMIN: number,
            TOKEN_LIMIT: number,
            MAIL_SENDER_API_KEY: string,
            TEST_MODE: number,
            MAIL_DOMAIN: string
        }
    }
}

export {}