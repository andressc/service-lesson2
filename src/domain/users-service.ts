import { idCreator } from '../helpers/idCreator';
import { usersRepository } from '../repositories/users-repository';
import bcrypt from 'bcrypt';
import { PaginationType, PaginationTypeQuery } from '../types/paginationType';
import { UsersType } from '../types/usersType';
import { paginationCalc } from '../helpers/paginationCalc';

export const usersService = {
	async findAllUsers(query: PaginationTypeQuery): Promise<PaginationType<UsersType[]>> {
		const search: { login?: {}; email?: {} } = {};
		query.searchLoginTerm ? (search.login = { $regex: query.searchLoginTerm.toString() }) : {};
		query.searchEmailTerm ? (search.email = { $regex: query.searchEmailTerm.toString() }) : {};
		const searchString = { ...search };

		console.log(searchString);

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
			passwordHash,
		};
		return await usersRepository.createUser(newUser);
	},

	async deleteUser(id: string): Promise<boolean> {
		return await usersRepository.deleteUser(id);
	},

	async checkCredentials(login: string, password: string): Promise<UsersType | null> {
		const user = await usersRepository.findByLogin(login);
		if (!user) {
			return null;
		}

		const passwordHashSalt = user.passwordHash.split('$');
		const passwordSalt = `$${passwordHashSalt[1]}$${
			passwordHashSalt[2]
		}$${passwordHashSalt[3].slice(0, 22)}`;
		const passwordHash = await this._generateHash(password, passwordSalt);

		if (user.passwordHash !== passwordHash) {
			return null;
		}

		return user;
	},

	async _generateHash(password: string, salt: string) {
		return await bcrypt.hash(password, salt);
	},
};
