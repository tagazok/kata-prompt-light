import { Injectable } from '@angular/core';
// import { createAwsSigner } from 'sign-aws-requests';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

import { CognitoIdentityClient, GetIdCommand, GetOpenIdTokenCommand } from "@aws-sdk/client-cognito-identity";
import { STSClient, AssumeRoleWithWebIdentityCommand } from "@aws-sdk/client-sts";


export interface IBedrockRequest {

}

export interface ClaudeV2Config {
  max_tokens_to_sample: number,
  temperature: number,
  top_k: number,
  top_p: number,
  stop_sequences: Array<string>,
  anthropic_version: string
};
export interface ClaudeV2 extends IBedrockRequest {
  prompt: string,
  options: ClaudeV2Config
};

export interface StableDiffusion extends IBedrockRequest {
  text_prompts?: Array<string>,
  cfg_scale: number,
  seed: number,
  steps: number
}

@Injectable({
  providedIn: 'root'
})
export class BedrockService {
  private region: string = "eu-central-1";
  private baseUrl: string = "";
  private sign: any;
  private host: string = ""
  private identityPoolId = "eu-central-1:2cb1b482-343b-40b1-aedc-a1ba27cd085b";
  private roleArn = "arn:aws:iam::080248937188:role/service-role/affirmationApp";

  constructor() {

    this.baseUrl = `https://bedrock.${this.region}.amazonaws.com`;

    this.host = `bedrock.${this.region}.amazonaws.com`;
  }

  private generateUrl(model: string) {
    return `${this.baseUrl}/model/${model}/invoke`;
  }

  
  async awsCredentialsForAnonymousUser() {
    // 1. Obtain a Cognito Identity Pool OpenId token.
    const cognitoClient = new CognitoIdentityClient({ region: this.region });
  
    const identity = await cognitoClient.send(new GetIdCommand({ IdentityPoolId: this.identityPoolId }));
    const token = await cognitoClient.send(new GetOpenIdTokenCommand({ IdentityId: identity.IdentityId }))
  
    // 2. exchange the Cognito OpenId token for an AWS access key and secret key.
    // This is done by assuming a role that defines the permission on these tokens
    const stsClient = new STSClient({ region: this.region });
    const credentials = await stsClient.send(new AssumeRoleWithWebIdentityCommand({
      RoleArn: this.roleArn,
      RoleSessionName: 'affirmationApp',
      WebIdentityToken: token.Token
    }));
  
    return {
      accessKeyId: credentials.Credentials?.AccessKeyId || "",
      secretAccessKey: credentials.Credentials?.SecretAccessKey || "",
      sessionToken: credentials.Credentials?.SessionToken || "",
      expiration: credentials.Credentials?.Expiration || new Date()
    };
  };


  async callModel(model: string, body: any) {

    const credentials = await this.awsCredentialsForAnonymousUser();

    const client = new BedrockRuntimeClient({ credentials: credentials, region: this.region }); 
    const input = {
      contentType: "application/json",
      accept: "application/json",
      modelId: "anthropic.claude-v2",
      body: JSON.stringify(body),
    };

    const command = new InvokeModelCommand(input);
    const response = await client.send(command);

    const affirmation = JSON.parse(
      new TextDecoder("utf-8").decode(response.body)
    ).completion;

    return affirmation || "";
    // <!-- if (response.status != 200) {
    //   throw new Error(data.message);
    // }
    // return data; -->
  }

  async callClaudeV2(prompt: string, options: ClaudeV2Config = { max_tokens_to_sample: 600, temperature: 1, top_k: 250, top_p: 0.999, stop_sequences: ["\n\nHuman:"], anthropic_version: "bedrock-2023-05-31" }) {
    const model = "anthropic.claude-v2";

    // const body = {
    //   prompt: `Human: ${prompt}\n\nAssistant:`,
    //   ...options
    // };
    const body = {
      prompt: `Human: ${prompt}\n\nAssistant:`,
      ...options
    };
    try {

      const result = await this.callModel(model, body);

      return result;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
