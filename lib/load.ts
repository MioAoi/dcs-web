import fs from 'fs';

export function loadCurrentPricing() {
    const pricings = JSON.parse(fs.readFileSync("profiles/pricing.json", "utf-8"));
    const currentPricing = pricings.find((p: any) => {
        const now = new Date();
        const validFrom = new Date(p.validFrom);
        return now >= validFrom;
    });
    const circadyRates = JSON.parse(fs.readFileSync(currentPricing?.circadyRates ?? "[]", "utf-8"));
    const loadedPricing = {
        ...currentPricing,
        circadyRates: circadyRates
    };
    return loadedPricing;
}
