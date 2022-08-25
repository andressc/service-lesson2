import jwt from 'jsonwebtoken';

export const jwtService = {
	async createJWT(user: any) {
		return jwt.sign({ id: user.id }, '56ytuhbvcw4rhe6rtcvjuoiporeesfh', {
			expiresIn: '1h',
		});
	},

	async verifyToken(token: any) {
		try {
			const result: any = jwt.verify(token, '56ytuhbvcw4rhe6rtcvjuoiporeesfh');

			return result.userId;
		} catch (e) {
			return null;
		}
	},
};
