import { Injectable } from '@angular/core';

import { Schema } from 'amplify/data/resource';

import { generateClient } from "aws-amplify/data";


@Injectable({
  providedIn: 'root'
})
export class BedrockService {
 
  async callClaudeV2(prompt: string): Promise<any> {
    const amplifyClient = generateClient<Schema>()

    const { data, errors } = await amplifyClient.mutations.bedrock({prompt: prompt});
    if (data) {
      return data.content || {};
    } else {
      throw new Error("error calling Bedrock");
    }
  }
}
