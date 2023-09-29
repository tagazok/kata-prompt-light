import { Injectable } from '@angular/core';
// import { createAwsSigner } from 'sign-aws-requests';

import { CognitoIdentityClient, GetIdCommand, GetOpenIdTokenCommand } from "@aws-sdk/client-cognito-identity";
import { STSClient, AssumeRoleWithWebIdentityCommand } from "@aws-sdk/client-sts";

import { AwsClient } from 'aws4fetch'

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
  private region: string = 'us-east-1';
  private baseUrl: string = "";
  private sign: any;
  private host: string = ""
  private identityPoolId = "us-east-1:f19b8aa4-01f4-4870-9dee-b440b37a3b71";

  constructor() {

    this.baseUrl = `https://bedrock.${this.region}.amazonaws.com`;

    this.host = `bedrock.${this.region}.amazonaws.com`;
  }

  private generateUrl(model: string) {
    return `${this.baseUrl}/model/${model}/invoke`;
  }

  async buildRequest(model: string, body: any) {

    const url = this.generateUrl(model);

    const cognitoClient = new CognitoIdentityClient({ region: this.region });
    const identity = await cognitoClient.send(new GetIdCommand({ IdentityPoolId: this.identityPoolId }));
    const token = await cognitoClient.send(new GetOpenIdTokenCommand({ IdentityId: identity.IdentityId }))

    const stsClient = new STSClient({ region: this.region });
    const credentials = await stsClient.send(new AssumeRoleWithWebIdentityCommand({
      RoleArn: "arn:aws:iam::697166389045:role/service-role/bedrock-test",
      RoleSessionName: 'ngBedrock',
      WebIdentityToken: token.Token
    }));
    console.log("creds", credentials);

    const aws = new AwsClient({
      accessKeyId: credentials.Credentials?.AccessKeyId || "",
      secretAccessKey: credentials.Credentials?.SecretAccessKey || "",
      sessionToken: credentials.Credentials?.SessionToken || ""
    });

    const request = await aws.sign(url, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
        Host: this.host,
      },
      body: JSON.stringify(body),
      aws: {
        signQuery: false,
        accessKeyId: credentials.Credentials?.AccessKeyId,
        secretAccessKey: credentials.Credentials?.SecretAccessKey,
        sessionToken: credentials.Credentials?.SessionToken,
        service: "bedrock",
        region: this.region,
        allHeaders: true,
      }
    });

    return request;
  }

  async callModel(model: string, body: any) {
    const request = await this.buildRequest(model, body);

    const response = await fetch(request);
    const data = await response.json();

    if (response.status != 200) {
      throw new Error(data.message);
    }
    return data;
  }

  async callClaudeV2(prompt: string, options: ClaudeV2Config = { max_tokens_to_sample: 600, temperature: 1, top_k: 250, top_p: 0.999, stop_sequences: ["\n\nHuman:"], anthropic_version: "bedrock-2023-05-31" }) {
    const model = "anthropic.claude-v2";

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
