import { prisma } from "@/lib/prisma"
import { messages } from "@/lib/messages"
import fs from 'fs'
interface Diet {
    name: string;
    availFrom: string | null;
    availTill: string | null;
    cash: number;
    bonus: number;
}
const DEPOSIT_DIETS: Diet[] = JSON.parse(fs.readFileSync('profiles/deposit_diets.json', 'utf-8'));

export async function POST(req: Request) {
    const { userId, dietName, manualTimeStamp } = await req.json()
    // 同用户同时间戳视为重复处理
    const existingDeposit = await prisma.deposit.findFirst({
        where: {
            userId,
            manualTimeStamp
        }
    })
    if (existingDeposit) {
        return Response.json({ error: messages.e400_manualDeposit }, { status: 400 })
    }
    await prisma.$transaction(async (tx) => {
        await tx.ledger.create({
            data: {
                userId,
                cashChange: DEPOSIT_DIETS.find(diet => diet.name === dietName)?.cash ?? 0,
                bonusChange: DEPOSIT_DIETS.find(diet => diet.name === dietName)?.bonus ?? 0,
                type: "DEPOSIT",
                note: `Diet: ${dietName}, time: ${manualTimeStamp}`,

                deposit: {
                    create: {
                        userId,
                        dietName,
                        manualTimeStamp
                    }
                }
            }
        })
    })
    const sumResult = await prisma.ledger.aggregate({
        where: { userId: userId },
        _sum: {
            cashChange: true,
            bonusChange: true,
        },
    });
    await prisma.user.update({
        where: { id: userId },
        data: {
            cashBalance: sumResult._sum.cashChange ?? 0,
            bonusBalance: sumResult._sum.bonusChange ?? 0,
            balance: (sumResult._sum.cashChange ?? 0) + (sumResult._sum.bonusChange ?? 0)
        }
    });
    return Response.json({ success: true }, { status: 200 })
}
