import 'next';

declare module 'next' {
  export type PageProps = {
    params?: Record<string, string | string[]>
    searchParams?: Record<string, string | string[]>
  }
}

// Fix for Next.js internal type check
declare module 'next/dist/build/webpack/loaders/next-types-loader/page-types' {
  export type PageProps = {
    params?: Record<string, string | string[]>
    searchParams?: Record<string, string | string[]>
  }
}
