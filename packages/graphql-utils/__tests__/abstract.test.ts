import {describe, expect} from 'vitest';

import {mapUnion, mapUnionWithDefault} from '../src';

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

const users: User[] = [
  {
    __typename: 'User',
    id: 'User:1',
    username: 'Hyeseong Kim',
    email: 'hey@hyeseong.kim',
    role: Role.Admin,
  },
];

const messages: ChatMessage[] = [
  {
    __typename: 'ChatMessage',
    id: 'ChatMessage:1',
    content: '아아아 타입스크립트...',
    user: users[0],
  },
];

const chats: Chat[] = [
  {
    __typename: 'Chat',
    id: 'Chat:1',
    users,
    messages,
  },
];

const results: SearchResult[] = [
  ...users,
  ...messages,
  ...chats,
];

describe('mapUnion', test => {
  test('map values', () => {
    const usernames = results
      .map(result => mapUnion(result, {
        User: user => user.username,
        Chat: chat => chat.users[0].username,
        ChatMessage: message => message.user.username,
      }));

    expect(usernames).toEqual([
      'Hyeseong Kim',
      'Hyeseong Kim',
      'Hyeseong Kim',
    ]);
  });

  test('invalid', () => {
    const invalid: SearchResult = {
      __typename: undefined,
      id: 'User:2',
      username: 'Invalid User',
      email: 'nah',
      role: Role.User,
    };

    expect(() => mapUnion(invalid, {
      User: 1,
      Chat: 2,
      ChatMessage: 3,
    })).toThrow();
  });
});

describe('mapUnionWithDefault', test => {
  test('map values', () => {
    const usernames = results
      .map(result => mapUnionWithDefault(result, {
        User: user => user.username,
        _: 'Hyeseong Kim',
      }));

    expect(usernames).toEqual([
      'Hyeseong Kim',
      'Hyeseong Kim',
      'Hyeseong Kim',
    ]);
  });

  test('invalid', () => {
    const invalid: SearchResult = {
      __typename: undefined,
      id: 'User:2',
      username: 'Invalid User',
      email: 'nah',
      role: Role.User,
    };

    expect(() => mapUnionWithDefault(invalid, {
      _: true,
    })).toThrow();
  });
});
