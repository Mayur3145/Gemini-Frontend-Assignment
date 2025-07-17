import 'react';

declare module 'react' {
  interface FunctionComponent {
    getLayout?: (page: React.ReactElement) => React.ReactNode;
  }
}
