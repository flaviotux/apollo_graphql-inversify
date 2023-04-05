import 'reflect-metadata';

import app from './bootstrap';
import { Kernel } from './http/kernel';

const kernel = app.get<Kernel>(Kernel);

kernel.handle();
