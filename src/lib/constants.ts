import * as HttpStatusPhrases from '@/openapi/http-status-phrases';
import { createMessageObjectSchema } from '@/openapi/schemas/create-message-object';

export const notFoundSchema = createMessageObjectSchema(
	HttpStatusPhrases.NOT_FOUND
);
