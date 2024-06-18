import { Injectable } from '@angular/core';
// import { createAwsSigner } from 'sign-aws-requests';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

import { CognitoIdentityClient, GetIdCommand, GetOpenIdTokenCommand } from "@aws-sdk/client-cognito-identity";
import { STSClient, AssumeRoleWithWebIdentityCommand } from "@aws-sdk/client-sts";
import { Schema } from 'amplify/data/resource';

import { generateClient } from "aws-amplify/data";


@Injectable({
  providedIn: 'root'
})
export class BedrockService {
 
  async callClaudeV2(prompt: string): Promise<any> {
    // const body = {
    //   prompt: `Human: ${prompt}\n\nAssistant:`,
    //   ...options
    // };
    const amplifyClient = generateClient<Schema>()

    const { data, errors } = await amplifyClient.mutations.bedrock({prompt: prompt});
    if (data) {
      return data.content || {};
    } else {
      throw new Error("error calling Bedrock");
    }
  }
}
