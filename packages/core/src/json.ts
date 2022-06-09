export type SerializableValue = (
  | null
  | number
  | string
  | boolean
  | SerializableValue[]
  | SerializableObject
);

export type SerializableObject = {
  [x: string]: SerializableValue,
};
