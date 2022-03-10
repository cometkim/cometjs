import { makeBaseEncoder, makeBaseDecoder } from '@urlpack/base-codec';
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
 * @example
 * ```js
 * const goi = makeGlobalID();
 * const id = goi.toID({ type: 'Post', id: post.id });
 * const { type, id } = goi.fromID(id);
 * ```
 */
export function makeGlobalID(): GlobalID {
  const alphabet = '123456789abcdefghijkmnopqrstuvwxyz';
  const base34Encoder = makeBaseEncoder(alphabet);
  const base34Decoder = makeBaseDecoder(alphabet);
  const jsonEncoder = makeJsonEncoder({ encodeBinary: base34Encoder.encode });
  const jsonDecoder = makeJsonDecoder({ decodeString: base34Decoder.decode });

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
