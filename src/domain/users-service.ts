import { idCreator } from '../helpers/idCreator';
import { usersRepository } from '../repositories/users-repository';
import bcrypt from 'bcrypt';
import { PaginationType, PaginationTypeQuery } from '../types/paginationType';
import { UsersType } from '../types/usersType';
import { paginationCalc } from '../helpers/paginationCalc';

export const usersService = {
	async findAllUsers(query: PaginationTypeQuery): Promise<PaginationType<UsersType[]>> {
		let searchString = {};

		const searchLoginTerm = query.searchLoginTerm
			? { login: { $regex: query.searchLoginTerm, $options: 'i' } }
			: null;
		const searchEmailTerm = query.searchEmailTerm
			? { email: { $regex: query.searchEmailTerm, $options: 'i' } }
			: null;

		if (searchLoginTerm) searchString = searchLoginTerm;
		if (searchEmailTerm) searchString = searchEmailTerm;

		if (searchLoginTerm && searchEmailTerm)
			searchString = { $or: [searchLoginTerm, searchEmailTerm] };

		const totalCount = await usersRepository.countUserData(searchString);

		const data = paginationCalc({ ...query, totalCount });

		return usersRepository.findAllUsers(data, searchString);
	},

	async findUserById(id: string): Promise<UsersType | null> {
		return usersRepository.findUserById(id);
	},

	async createUser(
		login: string,
		password: string,
		email: string,
	): Promise<{ id: string; login: string; email: string; createdAt: string } | null> {
		const passwordSalt = await bcrypt.genSalt(10);
		const passwordHash = await this._generateHash(password, passwordSalt);

		const newUser = {
			id: idCreator(),
			login,
			email,
			createdAt: new Date().toISOString(),
			passwordHash: passwordHash,
		};
		return await usersRepository.createUser(newUser);
	},

	async deleteUser(id: string): Promise<boolean> {
		return await usersRepository.deleteUser(id);
	},

	async checkCredentials(
		login: string,
		password: string,
		email: string,
	): Promise<boolean> {
		const user = await usersRepository.findByLogin(login, email);
		if (!user) {
			return false;
		}

		const passwordHashSalt = user.passwordHash.split('$');
		const passwordSalt = `$${passwordHashSalt[1]}$${
			passwordHashSalt[2]
		}$${passwordHashSalt[3].slice(0, 22)}`;
		const passwordHash = await this._generateHash(password, passwordSalt);

		return user.passwordHash === passwordHash;


	},

	async _generateHash(password: string, salt: string) {
		return await bcrypt.hash(password, salt);
	},
};
