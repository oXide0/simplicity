import { PrismaClient } from "./generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

const dbPath = path.join(__dirname, "..", "dev.db");

const adapter = new PrismaLibSql({
    url: `file:${dbPath}`,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
