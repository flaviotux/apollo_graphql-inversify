import { ApolloGraphQLProvider } from '../http/providers/graphql';

import { Provider } from '@/framework/support';

export const providers: (typeof Provider)[] = [ApolloGraphQLProvider];
