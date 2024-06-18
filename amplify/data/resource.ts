import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { bedrock } from '../functions/bedrock/resource';

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any unauthenticated user can "create", "read", "update", 
and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Challenge: a
    .model({
      id: a.string().required(),
      title: a.string().required(),
      description: a.string(),
      points: a.integer(),
      tests: a.hasMany('Test', 'challengeId')
    })
    .authorization((allow) => [allow.guest()]),
  Test: a
    .model({
      id: a.string().required(),
      name: a.string().required(),
      code: a.string().required(),
      points: a.integer().required(),
      challengeId: a.id().required(),
      challenge: a.belongsTo('Challenge', 'challengeId')
    })
    .authorization((allow) => [allow.guest()]),
  Game: a
    .model({
      id: a.id().required(),
      user: a.string().required(),
      score: a.integer().required(),
      event: a.string()
    })
    .authorization((allow) => [allow.guest()]),

  BedrockResponse: a.customType({
    content: a.string().required()
  }),

  bedrock: a.mutation()
    .arguments({ prompt: a.string().required() })
    .returns(a.ref('BedrockResponse'))
    .authorization(allow => [allow.guest()])
    .handler(a.handler.function(bedrock)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',
  },
});


// type Game @model @auth(rules: [{allow: public}]) {
//   id: ID!
//   user: String! 
//   score: Int!
//   completedChallenges: [String]
//   event: String! @index(name: "byScore", queryField: "usersByScore", sortKeyFields: ["score"])
// }


/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
