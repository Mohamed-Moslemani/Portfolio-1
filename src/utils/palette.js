export const OPEN_PALETTE_EVENT = "mm:open-search";
export const openCommandPalette = () => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
