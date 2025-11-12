import { createApp, createTestApp } from '@/lib/create-app';
import { testClient } from 'hono/testing';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { booksRouter } from './books.index';

describe('Books list', () => {
	it('should return a list of books', async () => {
		const testRouter = createTestApp(booksRouter);
		const response = await testRouter.request('/books');
		expect(response.status).toBe(200);
		const result = await response.json();
		expect(Array.isArray(result)).toBe(true);
	});

	it('should return a list of books on client', async () => {
		const client = testClient(createApp().route('/', booksRouter));
		const response = await client.books.$get();
		expect(response.status).toBe(200);
		const json = await response.json();
		if ('message' in json) {
			throw new Error('Expected array but got error object');
		}
		expectTypeOf(json).toBeArray();
	});

	it('it validates the params from url', async () => {
		const client = testClient(createApp().route('/', booksRouter));
		const response = await client.books[':id'].$get({
			param: {
				id: 'wat',
			},
		});

		expect(response.status).toBe(400);
	});

	it('it validates the body when creating', async () => {
		const client = testClient(createApp().route('/', booksRouter));
		const response = await client.books.$post({
			// @ts-expect-error
			json: {
				name: 'The Book',
			},
		});
		expect(response.status).toBe(400);
	});
});
