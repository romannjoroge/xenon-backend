declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DEBUG_MODE: number;
        }
    }
}

export {}