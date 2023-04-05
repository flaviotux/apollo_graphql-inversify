import express from 'express';
import { injectable } from 'inversify';

import { Kernel as HttpKernel } from '@/framework/foundation/http';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3333;

@injectable()
export class Kernel extends HttpKernel {
  public handle() {
    super.handle();

    const server = express();

    server.listen(port, host, () => {
      console.log(`[ ready ] http://${host}:${port}`);
    });
  }
}
