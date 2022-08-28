import jwt from 'jsonwebtoken';
import { UsersType } from '../types/usersType';

export const jwtService = {
	async createJWT(user: UsersType) {
		return jwt.sign({userId: user.id}, '56ytuhbvcw4rhe6rtcvjuoiporeesfh', {
			expiresIn: '1h',
		});
	},

	async getUserAuthByToken(token: string) {
		try {
			const result: any = jwt.verify(token, '56ytuhbvcw4rhe6rtcvjuoiporeesfh');
			return result;
		} catch (e) {
			return null;
		}
	},
};
