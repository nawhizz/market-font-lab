import { type Memo, type InsertMemo } from "@shared/schema";
import { db } from "../db";
import { memos } from "@shared/schema";

export interface IStorage {
  createMemo(memo: InsertMemo): Promise<Memo>;
}

export class DbStorage implements IStorage {
  async createMemo(insertMemo: InsertMemo): Promise<Memo> {
    const [memo] = await db.insert(memos).values(insertMemo).returning();
    return memo;
  }
}

export const storage = new DbStorage();
