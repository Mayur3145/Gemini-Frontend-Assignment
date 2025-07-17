import 'next';

declare module 'next' {
  export type PageProps<
    P extends Record<string, string> = {},
    Q extends Record<string, string | string[]> = {}
  > = {
    params: P;
    searchParams: Q;
  };
}
