import { defineFunction } from "@aws-amplify/backend";

export const MODEL_ID = 'anthropic.claude-v2'

export const bedrock = defineFunction({
  entry: './handler.ts',
  name: 'bedrock',
  timeoutSeconds: 60,
  environment: {
    MODEL_ID: MODEL_ID
  }
})