-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "qqid" TEXT,
    "createdAt" DATETIME NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CUSTOMER',
    "balance" INTEGER NOT NULL DEFAULT 0,
    "cashBalance" INTEGER NOT NULL DEFAULT 0,
    "bonusBalance" INTEGER NOT NULL DEFAULT 0,
    "chargeMultiplier" REAL NOT NULL DEFAULT 1.0
);
INSERT INTO "new_User" ("balance", "bonusBalance", "cashBalance", "createdAt", "id", "nickname", "password", "qqid", "role", "username") SELECT "balance", "bonusBalance", "cashBalance", "createdAt", "id", "nickname", "password", "qqid", "role", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_qqid_key" ON "User"("qqid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
