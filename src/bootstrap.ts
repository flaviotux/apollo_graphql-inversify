import { providers } from './config/app';
import { Kernel } from './http/kernel';

import { Application } from '@/framework/foundation';
import { Provider } from '@/framework/support';

const app = new Application();

app.bind<(typeof Provider)[]>('config.providers').toConstantValue(providers);

app.singletonIf<Kernel>(Kernel);

export default app;
