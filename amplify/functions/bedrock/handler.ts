import { Schema } from "../../data/resource";
import { env } from '$amplify/env/bedrock'
import { BedrockRuntimeClient, InvokeModelCommand, InvokeModelCommandInput } from "@aws-sdk/client-bedrock-runtime";

const bedrockClient = new BedrockRuntimeClient({ region: "us-west-2" });

export const handler = async (context: any) => {

    const messages: any[] = [
        {
            role: "user",
            content: [{
                type: 'text',
                text: context.arguments.prompt
            }],
        },
    ];

    const input: InvokeModelCommandInput = {
        modelId: "anthropic.claude-v2", //process.env.MODEL_ID,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            system:
                "In your reponse, explain your code and put the code of the function between the <lc-code></lc-code> xml tags. The generated code should be in JavaScript",
            messages: messages,
            max_tokens: 600,
            temperature: 1,
            top_k: 250,
            top_p: 0.999,
        }),
    };

    const result = await bedrockClient.send(new InvokeModelCommand(input))

    return {
        content: JSON.parse(Buffer.from(result.body).toString()).content[0].text ?? ""
    }
}