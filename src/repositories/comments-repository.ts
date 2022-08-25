import { commentsCollection } from '../db/db';
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
};
