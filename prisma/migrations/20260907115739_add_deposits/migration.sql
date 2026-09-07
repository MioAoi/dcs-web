-- CreateTable
CREATE TABLE "Deposit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "dietName" TEXT NOT NULL,
    "ledgerEntryId" INTEGER NOT NULL,
    "manualTimeStamp" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Deposit_ledgerEntryId_fkey" FOREIGN KEY ("ledgerEntryId") REFERENCES "Ledger" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Deposit_ledgerEntryId_key" ON "Deposit"("ledgerEntryId");
