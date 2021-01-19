import { expectEquals } from '@cometjs/core';

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
expectEquals<typeof t1, ChatMessage[]>();

const t2 = mapUnionWithDefault(result, {
  User: result => result.role,
  _: Role.User,
});
expectEquals<typeof t2, Role>();

const t3 = mapUnionWithDefault(result, {
  User: user => user.username,
  _: () => 'Anonymous',
});
expectEquals<typeof t3, string>();
