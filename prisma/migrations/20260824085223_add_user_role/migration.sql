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
    "role" TEXT NOT NULL DEFAULT 'CUSTOMER'
);
INSERT INTO "new_User" ("createdAt", "id", "nickname", "password", "qqid", "username") SELECT "createdAt", "id", "nickname", "password", "qqid", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_qqid_key" ON "User"("qqid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
