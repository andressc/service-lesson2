import { bloggersService } from '../domain/bloggers-service';
test('get blogger by id', async () => {
	await expect(bloggersService.findBloggerById(1661092938119)).resolves.toEqual({
		id: expect.any(Number),
		name: expect.any(String),
		youtubeUrl: expect.stringMatching(
			/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
		),
	});
});
