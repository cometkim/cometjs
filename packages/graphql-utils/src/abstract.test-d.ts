import { expectType } from 'tsd';
import type { IfEquals } from '@cometjs/core';

import { mapUnion, mapUnionWithDefault } from './abstract';

type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

type Node = {
  id: Scalars['ID'],
};

enum Role {
  User = 'USER',
  Admin = 'ADMIN'
}

type User = Node & {
  __typename?: 'User',
  id: Scalars['ID'],
  username: Scalars['String'],
  email: Scalars['String'],
  role: Role,
  nickname?: Scalars['String'],
};

type Chat = Node & {
  __typename?: 'Chat',
  id: Scalars['ID'],
  users: User[],
  messages: ChatMessage[],
};

type ChatMessage = Node & {
  __typename?: 'ChatMessage',
  id: Scalars['ID'],
  content: Scalars['String'],
  user: User,
};

type SearchResult = User | Chat | ChatMessage;

const result = {} as SearchResult;

const t1 = mapUnion(result, {
  User: [] as ChatMessage[],
  Chat: result => result.messages,
  ChatMessage: result => [result],
});
expectType<IfEquals<typeof t1, ChatMessage[], true>>(true);

const t2 = mapUnionWithDefault(result, {
  User: result => result.role,
  _: Role.User,
});
expectType<IfEquals<typeof t2, Role, true>>(true);

const t3 = mapUnionWithDefault(result, {
  User: user => user.username,
  _: () => 'Anonymous',
});
expectType<IfEquals<typeof t3, string, true>>(true);
