# @cometjs/core

## 2.3.2

### Patch Changes

- 49070fc: clean an unused dependency

## 2.3.1

### Patch Changes

- 1f6c8cd: Fix TypeScript declaration resolution

## 2.3.0

### Minor Changes

- 70ca666: Support TypeScript v5

## 2.2.0

### Minor Changes

- 2c04028: added some promise utils

## 2.1.1

### Patch Changes

- cef0284: Fix tuple helpers stability

## 2.1.0

### Minor Changes

- 057e735: added EmptyObject and AnyObject types
- 9c7e9a1: added utility types for JSON values

## 2.0.2

### Patch Changes

- bef6587: fix types entry on the package.json

## 2.0.1

### Patch Changes

- 5f5ac7d: packed missing typescript .d.ts files

## 2.0.0

### Major Changes

- 7e1c8f7: Change bundle config to make it ESM-first, and drop UMD format support
- 7e1c8f7: Remove Awaited<Promise> in favor of the TypeScript 4.5 built-in Awaited<T> type
- 7e1c8f7: Rename Fn.MergeMap to Fn.MergeRange and supports array
- 7e1c8f7: bump all packages
- 7e1c8f7: Change default error type for Result to unknown instead of Error

### Patch Changes

- 7e1c8f7: Update docs comments on Fn utils
- 7e1c8f7: Add a type util to infer domain of a fn
- 7e1c8f7: Fix expectEquals type assertion
