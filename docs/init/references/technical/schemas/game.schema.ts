import { z } from 'zod';

export const clueSchema = z.object({
  text: z.string().min(1).max(140).trim(),
});

export const voteActionSchema = z.enum(['VOTE', 'LINK', 'ACCUSE', 'SKIP']);

export const castVoteSchema = z.object({
  action: voteActionSchema,
  targets: z.array(z.string().uuid()),
  confirm: z.boolean(),
}).refine((data) => {
  // Validación de integridad según la acción elegida
  if (data.action === 'VOTE' || data.action === 'LINK') {
    return data.targets.length === 1;
  }
  if (data.action === 'ACCUSE') {
    return data.targets.length === 2;
  }
  if (data.action === 'SKIP') {
    return data.targets.length === 0;
  }
  return false;
}, {
  message: "La cantidad de objetivos no coincide con la acción elegida."
});

export type CluePayload = z.infer<typeof clueSchema>;
export type VoteAction = z.infer<typeof voteActionSchema>;
export type VotePayload = z.infer<typeof castVoteSchema>;
