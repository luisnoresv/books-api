import { createApp } from '@/lib/create-app';
import { testClient } from 'hono/testing';
import { describe, expect, it } from 'vitest';
import { booksRouter } from './books.index';

describe('Books list', () => {
	const app = createApp().route('/api', booksRouter);
	const client = testClient(app);

	it('should return a list of books', async () => {
		const response = await app.request('/api/books');
		expect(response.status).toBe(200);
		const result = await response.json();
		expect(Array.isArray(result)).toBe(true);
	});

	it('should return a list of books on client', async () => {
		const response = await client.api.books.$get();
		expect(response.status).toBe(200);
		const json = await response.json();
		expect(Array.isArray(json)).toBe(true);
	});

	it('it validates the params from url', async () => {
		const response = await client.api.books[':id'].$get({
			param: {
				id: 'wat',
			},
		});

		expect(response.status).toBe(400);
	});

	it('it validates the body when creating', async () => {
		const response = await app.request('/api/books', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				name: 'The Book',
			}),
		});
		expect(response.status).toBe(400);
	});
});
