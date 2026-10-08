-- CreateTable
CREATE TABLE "Bot" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "permissions" TEXT NOT NULL,

    CONSTRAINT "Bot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bot_nickname_key" ON "Bot"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "Bot_key_key" ON "Bot"("key");
