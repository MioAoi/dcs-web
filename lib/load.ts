import fs from 'fs';
import path from 'path';

export function loadCurrentPricing() {
    const pricings = JSON.parse(fs.readFileSync(path.join(process.cwd(), "profiles", "pricing.json"), "utf-8"));
    const currentPricing = pricings.find((p: any) => {
        const now = new Date();
        const validFrom = new Date(p.validFrom);
        return now >= validFrom;
    });
    if (!currentPricing) {
        throw new Error("No applicable pricing profile found");
    }
    const circadyRates = JSON.parse(fs.readFileSync(path.join(process.cwd(), currentPricing.circadyRates), "utf-8"));
    const loadedPricing = {
        ...currentPricing,
        circadyRates: circadyRates
    };
    return loadedPricing;
}
