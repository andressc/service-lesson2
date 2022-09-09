import {usersCollection, usersCollection2} from '../db/db';
import { PaginationCalc, PaginationType } from '../types/paginationType';
import { UsersType } from '../types/usersType';

export const usersRepository = {
	async findAllUsers(data: PaginationCalc, searchString: {}): Promise<PaginationType<UsersType[]>> {
		const items: UsersType[] = await usersCollection
			.find(searchString, { projection: { _id: 0, passwordHash: 0 } })
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

	async findUserById(id: string): Promise<UsersType | null> {
		const user: UsersType | null = await usersCollection.findOne(
			{ id },
			{ projection: { _id: 0 } },
		);

		if (user) {
			return user;
		}

		return null;
	},

	async deleteUser(id: string): Promise<boolean> {
		const result = await usersCollection.deleteOne({ id });
		return result.deletedCount === 1;
	},

	async deleteAllUsers(): Promise<boolean> {
		const result = await usersCollection.deleteMany({});
		return result.deletedCount === 1;
	},

	async createUser(
		newUser: UsersType,
	): Promise<{ id: string; login: string; email: string; createdAt: string }> {
		await usersCollection.insertOne({ ...newUser });
		await usersCollection2.insertOne({ ...newUser });

		const { id, login, email, createdAt } = newUser;
		return { id, login, email, createdAt };
	},

	/*async findByLogin(login: string, email: string): Promise<UsersType | null> {
		return await usersCollection.findOne({ $or: [{ login }, { email }]});
	},*/

	async findByLogin(login: string): Promise<UsersType | null> {
		return await usersCollection.findOne({ login });
	},

	async countUserData(search: {}): Promise<number> {
		return await usersCollection.countDocuments(search);
	},
};
