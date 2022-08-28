import {commentsCollection} from '../db/db';
import { CommentsType } from '../types/commentsType';

export const commentsRepository = {
	async findCommentById(id: string): Promise<CommentsType | null> {
		const comment: CommentsType | null = await commentsCollection.findOne(
			{ id },
			{ projection: { _id: 0 } },
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
		return newComment;
	},
};
