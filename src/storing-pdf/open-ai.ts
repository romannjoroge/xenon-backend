import OpenAI from "openai";
import "dotenv/config";

export const openai = new OpenAI({
    organization: process.env.OPEN_AI_ORG_ID ?? "",
    project: process.env.OPEN_AI_PROJ_ID ?? "",
});