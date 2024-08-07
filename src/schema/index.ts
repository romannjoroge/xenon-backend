import {z} from "zod";

export const feedBackSchema = z.array(z.object({
    serial: z.string(),
    section: z.string(),
    proposal: z.string(),
    justification: z.string()
})) 
export type Feedback = z.infer<typeof feedBackSchema>;
