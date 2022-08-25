import { CommentsType } from '../types/commentsType';
import { commentsRepository } from '../repositories/comments-repository';

export const commentsService = {
	async findCommentById(id: string): Promise<CommentsType | null> {
		return commentsRepository.findCommentById(id);
	},
};
