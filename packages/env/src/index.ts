import { z } from "zod"

const optionalInPhase1 = z.string().min(1).optional()

const serverSchema = z.object({
  CLERK_SECRET_KEY: z.string().min(1),

  DATABASE_URL: optionalInPhase1,
  R2_ACCOUNT_ID: optionalInPhase1,
  R2_ACCESS_KEY_ID: optionalInPhase1,
  R2_SECRET_ACCESS_KEY: optionalInPhase1,
  R2_BUCKET: optionalInPhase1,
  TRIGGER_SECRET_KEY: optionalInPhase1,
  STRIPE_SECRET_KEY: optionalInPhase1,
  STRIPE_WEBHOOK_SECRET: optionalInPhase1,
  ELEVENLABS_API_KEY: optionalInPhase1,
  ANTHROPIC_API_KEY: optionalInPhase1,
  SLACK_WEBHOOK_URL: optionalInPhase1,
})

const clientSchema = z.object({
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
})

export type ServerEnv = z.infer<typeof serverSchema>
export type ClientEnv = z.infer<typeof clientSchema>

export function parseServerEnv(source: Record<string, string | undefined>): ServerEnv {
  const result = serverSchema.safeParse(source)
  if (!result.success) {
    const flat = result.error.flatten().fieldErrors
    const lines = Object.entries(flat).map(([key, errors]) => `  ${key}: ${(errors ?? []).join(", ")}`)
    throw new Error(`Invalid server env:\n${lines.join("\n")}`)
  }
  return result.data
}

export function parseClientEnv(source: Record<string, string | undefined>): ClientEnv {
  const result = clientSchema.safeParse(source)
  if (!result.success) {
    const flat = result.error.flatten().fieldErrors
    const lines = Object.entries(flat).map(([key, errors]) => `  ${key}: ${(errors ?? []).join(", ")}`)
    throw new Error(`Invalid client env:\n${lines.join("\n")}`)
  }
  return result.data
}
