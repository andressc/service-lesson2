import { CommentsType } from '../types/commentsType';
import { commentsRepository } from '../repositories/comments-repository';
import { idCreator } from '../helpers/idCreator';
import {UsersType} from "../types/usersType";
import {usersService} from "./users-service";
import {HttpStatusCode} from "../types/StatusCode";

export const commentsService = {
	async findCommentById(id: string): Promise<CommentsType | null> {
		return commentsRepository.findCommentById(id);
	},

	async deleteComment(id: string, authUser: null | UsersType): Promise<boolean | HttpStatusCode> {
		const deletedComment = await commentsRepository.findCommentById(id)

		if(!deletedComment) {
			return false
		}

		if(!authUser) {
			return false
		}

		if(deletedComment.userId !== authUser.id) {
			return HttpStatusCode.FORBIDDEN
		}

		return await commentsRepository.deleteComment(id);
	},

	async updateComment(id: string, body: CommentsType, authUser: null | UsersType): Promise<boolean | HttpStatusCode> {
		const comment = await commentsRepository.findCommentById(id);
		if (!comment) {
			return false;
		}

		if(!authUser) {
			return false
		}

		if(comment.userId !== authUser.id) {
			return HttpStatusCode.FORBIDDEN
		}

		return await commentsRepository.updateComment(id, body.content);
	},

	async createComment(content: string, authUser: null | UsersType ) {
		if(!authUser) {
			return null
		}

		const user = await usersService.findUserById(authUser.id);
		if (!user) {
			return null;
		}

		const newComment: CommentsType = {
			id: idCreator(),
			content,
			userId: user.id,
			userLogin: user.login,
			addedAt: new Date().toISOString()
		}

		return await commentsRepository.createComment(newComment);
	},
};
