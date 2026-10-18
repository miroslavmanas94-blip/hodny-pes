export const BREEDS = [
  { id: "border-collie", name: "Border kolie", coat: ["black-white", "red-white"] },
  { id: "sheltie", name: "Šeltie", coat: ["tricolor", "sable"] },
  { id: "australian-shepherd", name: "Australský ovčák", coat: ["blue-merle", "red-merle"] },
  { id: "golden-retriever", name: "Zlatý retrívr", coat: ["golden"] },
  { id: "labrador", name: "Labradorský retrívr", coat: ["black", "yellow", "chocolate"] },
  { id: "german-shepherd", name: "Německý ovčák", coat: ["black-tan"] },
  { id: "cattle-dog", name: "Australský honácký pes", coat: ["blue-speckled"] },
  { id: "beagle", name: "Bígl", coat: ["tricolor"] },
  { id: "corgi", name: "Corgi", coat: ["red-white", "tricolor"] },
  { id: "poodle", name: "Pudl", coat: ["black", "white", "apricot"] },
  { id: "dalmatian", name: "Dalmatin", coat: ["white-black-spots"] },
  { id: "belgian-shepherd", name: "Belgický ovčák", coat: ["fawn-black"] },
  { id: "dachshund", name: "Jezevčík", coat: ["red", "black-tan"] },
  { id: "shiba", name: "Shiba inu", coat: ["red", "sesame"] },
  { id: "cavalier", name: "Kavalír King Charles španěl", coat: ["blenheim", "tricolor"] }
] as const;

export const MISSIONS = [
  { id: "welcome", title: "První společná procházka", description: "Rozhlédni se po cvičišti a projdi se se svým psem.", reward: 30, goal: 8 },
  { id: "sit", title: "První povel: Sedni", description: "Vyzkoušej povel Sedni a odměň svého parťáka.", reward: 45, goal: 1 },
  { id: "puller-first", title: "První Puller", description: "Hoď kruh a zkus ho se psem znovu získat.", reward: 60, goal: 1 }
] as const;

export type PullerMode = "practice" | "running" | "jumping";
export type PullerAttempt = { caught: boolean; returned: boolean; distance: number; airtime: number; safeLanding: boolean };

export function experienceForNextLevel(level: number): number {
  return Math.max(100, Math.floor(100 * Math.pow(Math.max(1, level), 1.35)));
}
export function levelFromExperience(experience: number): number {
  let level = 1;
  let remaining = Math.max(0, Math.floor(experience));
  while (remaining >= experienceForNextLevel(level) && level < 100) {
    remaining -= experienceForNextLevel(level);
    level += 1;
  }
  return level;
}
export function scorePullerAttempt(mode: PullerMode, attempt: PullerAttempt): number {
  if (!attempt.caught || !attempt.safeLanding) return 0;
  const distance = Math.max(0, Math.min(30, attempt.distance));
  const airtime = Math.max(0, Math.min(3, attempt.airtime));
  if (mode === "practice") return Math.round(10 + distance * 2 + (attempt.returned ? 10 : 0));
  if (mode === "running") return Math.round(20 + distance * 1.5 + (attempt.returned ? 20 : 0));
  return Math.round(15 + airtime * 10 + distance + (attempt.returned ? 10 : 0));
}
export function canAfford(coins: number, price: number): boolean {
  return Number.isSafeInteger(coins) && Number.isSafeInteger(price) && coins >= 0 && price >= 0 && coins >= price;
}
export function rewardOnce(alreadyClaimed: boolean, reward: number): number {
  return alreadyClaimed ? 0 : Math.max(0, Math.floor(reward));
}
