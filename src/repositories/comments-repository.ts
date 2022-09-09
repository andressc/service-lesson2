import { commentsCollection } from '../db/db';
import { CommentsType } from '../types/commentsType';
import { PaginationCalc, PaginationType } from '../types/paginationType';

export const commentsRepository = {
	async findAllComments(
		data: PaginationCalc,
		searchString: {},
	): Promise<PaginationType<CommentsType[]>> {
		const items: CommentsType[] = await commentsCollection
			.find(searchString, { projection: { _id: 0, postId: 0 } })
			.skip(data.skip)
			.limit(data.pageSize)
			.sort(data.sortBy)
			.toArray();

		return {
			pagesCount: data.pagesCount,
			page: data.pageNumber,
			pageSize: data.pageSize,
			totalCount: data.totalCount,
			items,
		};
	},

	async findCommentById(id: string): Promise<CommentsType | null> {
		const comment: CommentsType | null = await commentsCollection.findOne(
			{ id },
			{ projection: { _id: 0, postId: 0 } },
		);

		if (comment) {
			return comment;
		}

		return null;
	},

	async deleteComment(id: string): Promise<boolean> {
		const result = await commentsCollection.deleteOne({ id });
		return result.deletedCount === 1;
	},

	async updateComment(id: string, content: string): Promise<boolean> {
		const result = await commentsCollection.updateOne({ id }, { $set: { content } });
		return result.matchedCount === 1;
	},

	async createComment(newComment: CommentsType): Promise<CommentsType | null> {
		await commentsCollection.insertOne({ ...newComment });

		const { id, content, userId, userLogin, createdAt } = newComment;

		return { id, content, userId, userLogin, createdAt };
	},

	async countCommentsData(search: {}): Promise<number> {
		return await commentsCollection.countDocuments(search);
	},
};
