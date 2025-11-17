import { serve } from '@hono/node-server';

import { app } from '@/app';
import env from '@/env';
import { API_PATH } from '@/lib/constants';

const port = Number(env.PORT) || 3000;
console.info(`API is running on http://localhost:${port}${API_PATH}`);

serve({
	fetch: app.fetch,
	port,
});
