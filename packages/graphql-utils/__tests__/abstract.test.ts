import { mapUnion, mapUnionWithDefault } from '../src/abstract';

type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  Date: any,
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
  time: Scalars['Date'],
  user: User,
};

type SearchResult = User | Chat | ChatMessage;

const result = {} as SearchResult;

// $ExpectType ChatMessage[]
const a = mapUnion(result, {
  User: [] as ChatMessage[],
  Chat: result => result.messages,
  ChatMessage: result => [result],
});

// $ExpectType Role
const b = mapUnionWithDefault(result, {
  User: result => result.role,
  _: Role.User,
});

// $ExpectType string
const c = mapUnionWithDefault(result, {
  User: result => result.nickname,
  _: 'Anonymous',
});
