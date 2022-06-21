import { makeJsonEncoder, makeJsonDecoder } from '@urlpack/json';

type GlobalIDSource = {
  typename: string,
  id: string,
};

interface GlobalID {
  toID(source: GlobalIDSource): string;
  fromID(id: string): GlobalIDSource;
}

export class GlobalIDFormatError extends TypeError {
  constructor() {
    super('Invalid ID');
  }
}

/**
 * Build Global ID helper
 *
 * Same as graphql-relay-js, but it is safe to be included in the URL.
 *
 * @example
 * ```js
 * const resource = makeGlobalID();
 * const gid = resource.toID({ typename: 'Post', id: post.id });
 * const { typename, id } = resource.fromID(gid);
 * ```
 */
export function makeGlobalID(): GlobalID {
  const jsonEncoder = makeJsonEncoder();
  const jsonDecoder = makeJsonDecoder();

  return {
    toID: source => jsonEncoder.encode([
      source.typename || null,
      source.id || null,
    ]),
    fromID: id => {
      const result = jsonDecoder.decode(id);
      if (Array.isArray(result)) {
        const [typename, id] = result as unknown[];
        if (
          typeof typename === 'string' &&
          typeof id === 'string'
        ) {
          return { typename, id };
        }
      }
      throw new GlobalIDFormatError();
    },
  };
}
