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
    const circadyRates = JSON.parse(fs.readFileSync(path.join(/*turbopackIgnore: true*/ process.cwd(), currentPricing.circadyRates), "utf-8"));
    const loadedPricing = {
        ...currentPricing,
        circadyRates: circadyRates
    };
    return loadedPricing;
}

export function loadCurrentPassGara() {
    const passGaras = JSON.parse(fs.readFileSync(path.join(process.cwd(), "profiles", "pass_gara.json"), "utf-8"));
    const now = new Date();
    const currentPassGara = passGaras.find((p: any) => {
        const useFrom = new Date(p.useFrom);
        const useTill = new Date(p.useTill);
        return now >= useFrom && now <= useTill;
    });
    if (!currentPassGara) {
        throw new Error("No applicable pass gara profile found");
    }
    return currentPassGara;
}
