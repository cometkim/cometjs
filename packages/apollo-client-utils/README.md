# @cometjs/apollo-client-utils

## useQuery

Restrict Apollo Client's useQuery with pre-defined N-variants.

This utility helps to make behavior more predictable and type-safety by restricting some options and variants. (1-Query, 3-Variants)

It hides some options that included in Apollo Client by default, to avoid relying on over-exposed API surface.

For example `pollInterval`, if you necessary it, you should call `refetch()` in useEffect by your hand. (Seriously, instead of relying on a black-box, separate it per concern)

Partial rendering and `errorPolicy: all` (which makes possible variants infinity) are intentionally disallowed. If you need it, use the Apollo Client as it is.
