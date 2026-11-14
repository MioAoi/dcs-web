"use server";
import EnterButton from "@/components/EnterButton";
import { getCurrentVisit } from "@/lib/visits";
import LeaveButton from "@/components/LeaveButton";
import { requireUserOrRedirect } from "@/lib/auth";
import { formatMoneyFen } from "@/lib/money";
import { loadCurrentPricingv2 } from "@/lib/load";
import fs from "fs";
import path from "path";
import { formatFLTToMinutes, greeting } from "@/lib/datetime";
import { getUserPass, getUserTotalSpent, userHasCurrentBooking, getVenueBooking } from "@/lib/users";
import { QRCodeSVG } from "qrcode.react";
import PlayerNavigation from "@/components/PlayerNavigation";
import UserPricingSummary from "@/components/UserPricingSummary";
import PassLiteCard from "@/components/pass/PassLiteCard";
import { calculateCharge } from "@/lib/pricingv2";

export default async function Dashboard() {
    const now = new Date().getTime();

    const currentPricing = await loadCurrentPricingv2();
    const admissionBalance = currentPricing?.admissionBalance ?? 0;
    const user = await requireUserOrRedirect();
    const userPass = await getUserPass(user.id);
    const recent30dSpent = await getUserTotalSpent(user.id, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date());

    const timeString = formatFLTToMinutes(now, false);

    const announcements: { message4All: string[], message4Paid: string[] } = JSON.parse(fs.readFileSync(path.join(process.cwd(), "profiles", "announcements.json"), "utf-8"));
    
    const displayName = user.nickname || user.username || "棍母";
    const currentVisit = await getCurrentVisit(user.id);
    const notInVenue = (!currentVisit || currentVisit.leftAt);
    const hasCurrentBooking = await userHasCurrentBooking(user.id);
    const currentVenueBooking = await getVenueBooking();
    const stayTimeString = !notInVenue ? Math.ceil((now - currentVisit.enteredAt.getTime()) / 60000) + "分钟" : hasCurrentBooking ? "包机中" : "不在店";

    const scanDoorActive = fs.readFileSync(path.join(process.cwd(), "扫码开门启用否.txt"), "utf-8").charAt(0) === "y";
    const antcpCharge = currentVisit ? calculateCharge(currentVisit.enteredAt, new Date(), currentPricing.rater).total * user.chargeMultiplier : undefined;

    return (
        <main>
            <PlayerNavigation  buttonLogout={true} />
            <div className="master-width invwindow split" style={{ marginBottom: "0rem", paddingBottom: "0rem" }} >
                <span>{greeting()}，{displayName}</span>
                <span className="info-value bear-right">{timeString}</span>
            </div>
            <UserPricingSummary userId={user.id} />
            <div className="master-width windowlike" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", columnGap: "1rem" }}>
                <div>
                    总余额<br/>
                    <div className="nulldiv" style={{ display: "flex", justifyContent: "right" }}><span className={user.balance >= admissionBalance ? "info-value" : "money-owe"}>{formatMoneyFen(user.balance ?? 0)}</span></div>
                </div>
                <div>
                    现金<br/>
                    <div className="nulldiv" style={{ display: "flex", justifyContent: "right" }}><span className="info-value">{formatMoneyFen(user.cashBalance ?? 0)}</span></div>
                </div>
                <div>
                    赠点<br/>
                    <div className="nulldiv" style={{ display: "flex", justifyContent: "right" }}><span className="info-value">{formatMoneyFen(user.bonusBalance ?? 0)}</span></div>
                </div>
                <div>
                    30d 消费<br/>
                    <div className="nulldiv" style={{ display: "flex", justifyContent: "right" }}><span className="info-value">{formatMoneyFen(recent30dSpent)}</span></div>
                </div>
            </div>
            { userPass && <PassLiteCard /> }
            <div className="master-width windowlike generic-vert-grid">
                <div className="bipartite">
                    <div>
                        <EnterButton state={user.balance < admissionBalance ? "disabled" : currentVenueBooking ? "disabled" : hasCurrentBooking ? "disabled" : notInVenue ? "enter" : "refresh"} />
                        <div className="bipartite">
                            <div>在店时长<br/>
                                <span className="info-value">{stayTimeString}</span><br/>
                            </div>
                            {
                                antcpCharge !== undefined &&
                                <div>预计扣费<br/>
                                    <span className="info-value">{formatMoneyFen(antcpCharge ?? 0)}</span><br/>
                                </div>
                            }
                        </div>
                        <LeaveButton disabled={notInVenue || hasCurrentBooking ? true : false} />
                    </div>

                    <div style={{ alignItems: "center", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        {!scanDoorActive ?
                        <div className="entranceQr" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", writingMode: "vertical-rl" }}>
                            <b style={{ fontSize: "1.6rem", textAlign: "center"}}>扫码开门<br/>尚未启用</b>
                        </div>
                        :
                        currentVisit?.token ?<div className="entranceQr">
                            <QRCodeSVG 
                                value={currentVisit?.token}
                                size={160}
                                marginSize={4}
                            />
                        </div>
                        :
                        <div className="entranceQr" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", writingMode: "vertical-rl" }}>
                            <b style={{ fontSize: "1.6rem", textAlign: "center"}}>进店后启用<br/>离店前有效</b>
                        </div>}
                    </div>
                    
                </div>
            </div>
            <div className="master-width windowlike">
                {announcements.message4All.map((msg, index) => (
                    <span key={index} >{msg}<br/></span>
                ))}
                {user.balance >= admissionBalance && announcements.message4Paid.map((msg, index) => (
                    <span key={index} >{msg}<br/></span>
                ))}
            </div>
        </main>
    );
}
