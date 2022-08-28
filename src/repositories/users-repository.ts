import { usersCollection } from '../db/db';
import { PaginationType, PaginationTypeQuery } from '../types/paginationType';
import { paginationCalc } from '../helpers/paginationCalc';
import { UsersType } from '../types/usersType';

export const usersRepository = {
	async findAllUsers(query: PaginationTypeQuery): Promise<PaginationType<UsersType[]>> {
		const totalCount = await usersCollection.countDocuments({});

		const {
			pagesCount: pagesCount,
			page,
			pageSize,
			skip,
		} = paginationCalc({ ...query, totalCount });

		const items: UsersType[] = await usersCollection
			.find({}, { projection: { _id: 0, passwordHash: 0 } })
			.skip(skip)
			.limit(pageSize)
			.toArray();

		return { pagesCount, page, pageSize, totalCount, items };
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

	async createUser(newUser: UsersType): Promise<{ id: string; login: string }> {
		await usersCollection.insertOne({ ...newUser });

		const { id, login } = newUser;
		return { id, login };
	},

	async findByLogin(login: string): Promise<UsersType | null> {
		return await usersCollection.findOne({ login });
	},
};
