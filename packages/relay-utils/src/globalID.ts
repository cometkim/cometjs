import { makeJsonEncoder, makeJsonDecoder } from '@urlpack/json';

type GlobalIDSource = {
  type: string,
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
 * const goi = makeGlobalID();
 * const id = goi.toID({ type: 'Post', id: post.id });
 * const { type, id } = goi.fromID(id);
 * ```
 */
export function makeGlobalID(): GlobalID {
  const jsonEncoder = makeJsonEncoder();
  const jsonDecoder = makeJsonDecoder();

  return {
    toID: source => jsonEncoder.encode(source),
    fromID: id => {
      const result = jsonDecoder.decode(id);
      if (result && typeof result === 'object') {
        const obj = result as Partial<GlobalIDSource>;
        if (obj.id && obj.type) {
          return obj as GlobalIDSource;
        }
      }
      throw new GlobalIDFormatError();
    },
  };
}
