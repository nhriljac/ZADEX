// Zadex catalog data: terpenes, products, stores, deals, and option lists.
// Swap these arrays for an API later — the rest of the app only reads them through
// the helpers at the bottom of this file and the ZadexProvider.

export const TERPENES = [
  {
    id: "myrcene", name: "Myrcene", color: "#6b8e6b",
    aromas: ["Earthy", "Musky", "Herbal", "Cloves"],
    characteristics: "Sedating, relaxing — the most common cannabis terpene.",
    educational: "Myrcene is commonly associated with earthy, musky aromas and is frequently described as contributing to a calming, sedating sensory profile. Many users describe myrcene-dominant varieties as relaxing.",
    occurs: "Mango, lemongrass, thyme, hops, bay leaves.",
    sensory: "Often lends a soft, heavy, grounded character to a product's aroma.",
  },
  {
    id: "limonene", name: "Limonene", color: "#d9b656",
    aromas: ["Citrus", "Lemon", "Orange", "Bright"],
    characteristics: "Uplifting, bright — often found in citrus-forward varieties.",
    educational: "Limonene is commonly associated with citrus aromas and is frequently found in cannabis varieties described as bright or uplifting. Users may describe these products as energizing or mood-lifting.",
    occurs: "Citrus fruit rinds, juniper, peppermint.",
    sensory: "Adds a crisp, clean, citrus lift that reads as fresh and bright.",
  },
  {
    id: "caryophyllene", name: "Caryophyllene", color: "#b06a4a",
    aromas: ["Pepper", "Spice", "Woody", "Cloves"],
    characteristics: "Spicy, peppery — the only terpene that also acts on CB2 receptors.",
    educational: "Caryophyllene is commonly associated with peppery, spicy aromas. Users may describe products with higher caryophyllene as grounding or tension-easing. It is unique among terpenes for also interacting with the endocannabinoid system.",
    occurs: "Black pepper, cloves, cinnamon, basil.",
    sensory: "Brings a warm, peppery bite that adds depth and complexity.",
  },
  {
    id: "pinene", name: "Pinene", color: "#4f7a5a",
    aromas: ["Pine", "Earthy", "Forest", "Fresh"],
    characteristics: "Alert, clear — reminiscent of a forest.",
    educational: "Pinene is commonly associated with pine and fresh forest aromas. Users may describe pinene-forward products as clarifying or focusing. It is one of the most abundant terpenes in nature.",
    occurs: "Pine needles, rosemary, basil, dill.",
    sensory: "Contributes a sharp, resinous freshness that lifts the nose.",
  },
  {
    id: "linalool", name: "Linalool", color: "#9a7fb0",
    aromas: ["Floral", "Lavender", "Sweet", "Soft"],
    characteristics: "Calming, floral — associated with relaxation.",
    educational: "Linalool is commonly associated with floral, lavender-like aromas. Users may describe linalool-forward products as calming or soothing. It is also found in many relaxing essential oils.",
    occurs: "Lavender, birch bark, coriander, rose.",
    sensory: "Adds a soft, rounded floral note that smooths sharper terpenes.",
  },
  {
    id: "terpinolene", name: "Terpinolene", color: "#5e9aa0",
    aromas: ["Piney", "Floral", "Herbal", "Slightly fruity"],
    characteristics: "Complex, multifaceted — pine + floral + fruit.",
    educational: "Terpinolene is commonly associated with a complex aroma that blends pine, floral, and herbal notes. Users may describe terpinolene-dominant varieties as energizing yet layered.",
    occurs: "Cumin, tea tree, lilac, nutmeg.",
    sensory: "A multifaceted terpene that adds complexity without a single dominant note.",
  },
  {
    id: "humulene", name: "Humulene", color: "#8a8f5a",
    aromas: ["Earthy", "Woody", "Spicy", "Hoppy"],
    characteristics: "Earthy, grounding — also found in hops.",
    educational: "Humulene is commonly associated with earthy, woody aromas and is a defining terpene in hops. Users may describe humulene-forward products as grounding.",
    occurs: "Hops, coriander, ginseng, sage.",
    sensory: "Adds an earthy, woody backbone similar to craft beer hops.",
  },
  {
    id: "ocimene", name: "Ocimene", color: "#7fae7f",
    aromas: ["Sweet", "Herbal", "Citrus", "Tropical"],
    characteristics: "Sweet, light — uplifting and airy.",
    educational: "Ocimene is commonly associated with sweet, herbal, and citrus aromas. Users may describe ocimene-forward products as light and uplifting.",
    occurs: "Mint, parsley, basil, kumquat.",
    sensory: "A light, sweet, airy note that brightens heavier profiles.",
  },
];

const t = (id, pct) => ({ id, pct });

export const PRODUCTS = [
  { id: "blue-dream", name: "Blue Dream", brand: "Cascadia Collective", strain: "Sativa-dominant Hybrid", product_type: "Flower", thc: 22, cbd: 0.1, description: "A balanced sativa-dominant hybrid with berry sweetness and a smooth, uplifting character. A widely-loved daytime variety.", effects: ["Uplifted", "Creative", "Energetic", "Happy", "Focused"], flavor: ["Berry", "Sweet", "Earthy"], aroma: ["Sweet", "Berry", "Pine"], terpenes: [t("myrcene", 38), t("limonene", 28), t("caryophyllene", 18), t("pinene", 10), t("linalool", 6)] },
  { id: "gelato", name: "Gelato", brand: "Maison Verde", strain: "Indica-dominant Hybrid", product_type: "Flower", thc: 24, cbd: 0.1, description: "A dessert-like hybrid with creamy sweetness and a balanced euphoria. Known for a smooth, flavorful experience.", effects: ["Euphoric", "Relaxed", "Happy", "Creative"], flavor: ["Sweet", "Creamy", "Citrus"], aroma: ["Sweet", "Earthy", "Citrus"], terpenes: [t("limonene", 34), t("caryophyllene", 26), t("myrcene", 22), t("humulene", 12), t("linalool", 6)] },
  { id: "sunset-sherbet", name: "Sunset Sherbet", brand: "Maison Verde", strain: "Indica-dominant Hybrid", product_type: "Flower", thc: 23, cbd: 0.1, description: "A fruity, dessert-forward hybrid with creamy berry notes and a mellow, euphoric character.", effects: ["Relaxed", "Happy", "Euphoric", "Uplifted"], flavor: ["Berry", "Citrus", "Creamy"], aroma: ["Sweet", "Fruity", "Earthy"], terpenes: [t("limonene", 32), t("myrcene", 28), t("caryophyllene", 20), t("linalool", 12), t("pinene", 8)] },
  { id: "sour-diesel", name: "Sour Diesel", brand: "Eastside Farms", strain: "Sativa", product_type: "Flower", thc: 25, cbd: 0.1, description: "A fast-acting sativa with a pungent, fuel-like aroma and an energizing, cerebral character.", effects: ["Energetic", "Uplifted", "Focused", "Happy"], flavor: ["Diesel", "Citrus", "Earthy"], aroma: ["Pungent", "Diesel", "Citrus"], terpenes: [t("caryophyllene", 36), t("limonene", 28), t("myrcene", 18), t("humulene", 12), t("pinene", 6)] },
  { id: "og-kush", name: "OG Kush", brand: "Legacy Co.", strain: "Hybrid", product_type: "Flower", thc: 24, cbd: 0.1, description: "A classic hybrid with an earthy, piney aroma and a balanced, tension-easing character.", effects: ["Relaxed", "Happy", "Euphoric", "Sleepy"], flavor: ["Earthy", "Pine", "Woody"], aroma: ["Earthy", "Pine", "Spice"], terpenes: [t("myrcene", 34), t("caryophyllene", 26), t("limonene", 20), t("pinene", 12), t("humulene", 8)] },
  { id: "northern-lights", name: "Northern Lights", brand: "Legacy Co.", strain: "Indica", product_type: "Flower", thc: 20, cbd: 0.1, description: "A legendary pure indica with a sweet, spicy aroma and a deeply relaxing, sedating character.", effects: ["Relaxed", "Sleepy", "Calm", "Happy"], flavor: ["Sweet", "Spicy", "Earthy"], aroma: ["Sweet", "Earthy", "Pine"], terpenes: [t("myrcene", 44), t("caryophyllene", 22), t("pinene", 14), t("linalool", 12), t("humulene", 8)] },
  { id: "pineapple-express", name: "Pineapple Express", brand: "Cascadia Collective", strain: "Sativa-dominant Hybrid", product_type: "Vape", thc: 21, cbd: 0.1, description: "A tropical sativa-leaning hybrid with bright pineapple notes and an energizing, creative character.", effects: ["Energetic", "Uplifted", "Creative", "Happy"], flavor: ["Pineapple", "Tropical", "Citrus"], aroma: ["Tropical", "Sweet", "Citrus"], terpenes: [t("limonene", 36), t("myrcene", 26), t("pinene", 18), t("caryophyllene", 12), t("ocimene", 8)] },
  { id: "zkittlez", name: "Zkittlez", brand: "Maison Verde", strain: "Indica-dominant Hybrid", product_type: "Flower", thc: 22, cbd: 0.1, description: "A fruit-forward indica hybrid with candy sweetness and a calm, happy character.", effects: ["Relaxed", "Happy", "Calm", "Sleepy"], flavor: ["Candy", "Tropical", "Sweet"], aroma: ["Sweet", "Fruity", "Tropical"], terpenes: [t("myrcene", 32), t("limonene", 26), t("caryophyllene", 22), t("linalool", 12), t("humulene", 8)] },
  { id: "wedding-cake", name: "Wedding Cake", brand: "The Reserve", strain: "Indica-dominant Hybrid", product_type: "Concentrate", thc: 27, cbd: 0.1, description: "A rich, dessert-like indica hybrid with creamy, tangy notes and a potent, relaxing character.", effects: ["Relaxed", "Euphoric", "Happy", "Sleepy"], flavor: ["Creamy", "Tangy", "Vanilla"], aroma: ["Sweet", "Earthy", "Vanilla"], terpenes: [t("limonene", 30), t("caryophyllene", 26), t("myrcene", 24), t("humulene", 12), t("linalool", 8)] },
  { id: "jack-herer", name: "Jack Herer", brand: "Eastside Farms", strain: "Sativa", product_type: "Flower", thc: 23, cbd: 0.1, description: "A piney, peppery sativa with a clear-headed, creative, and energizing character.", effects: ["Focused", "Energetic", "Creative", "Uplifted"], flavor: ["Pine", "Peppery", "Citrus"], aroma: ["Pine", "Earthy", "Spice"], terpenes: [t("pinene", 32), t("terpinolene", 24), t("caryophyllene", 20), t("limonene", 16), t("myrcene", 8)] },
  { id: "granddaddy-purple", name: "Granddaddy Purple", brand: "Legacy Co.", strain: "Indica", product_type: "Flower", thc: 19, cbd: 0.1, description: "A grape-flavored pure indica with berry sweetness and a heavy, sedating, relaxing character.", effects: ["Sleepy", "Relaxed", "Happy", "Hungry"], flavor: ["Grape", "Berry", "Sweet"], aroma: ["Grape", "Berry", "Earthy"], terpenes: [t("myrcene", 40), t("linalool", 22), t("caryophyllene", 18), t("pinene", 12), t("humulene", 8)] },
  { id: "acdc", name: "ACDC", brand: "Bare Labs", strain: "Sativa-dominant", product_type: "Tincture", thc: 1, cbd: 18, description: "A high-CBD, low-THC variety often chosen by those seeking a clear, non-intoxicating experience.", effects: ["Calm", "Focused", "Relaxed"], flavor: ["Earthy", "Herbal", "Citrus"], aroma: ["Earthy", "Herbal", "Citrus"], terpenes: [t("myrcene", 28), t("pinene", 26), t("caryophyllene", 22), t("limonene", 16), t("linalool", 8)] },
  { id: "durban-poison", name: "Durban Poison", brand: "Eastside Farms", strain: "Sativa", product_type: "Flower", thc: 24, cbd: 0.1, description: "A pure landrace sativa with sweet, spicy anise notes and an energizing, focused character.", effects: ["Energetic", "Focused", "Uplifted", "Creative"], flavor: ["Anise", "Sweet", "Spicy"], aroma: ["Sweet", "Spicy", "Earthy"], terpenes: [t("terpinolene", 38), t("limonene", 24), t("myrcene", 18), t("pinene", 12), t("ocimene", 8)] },
  { id: "strawberry-cough", name: "Strawberry Cough", brand: "Cascadia Collective", strain: "Sativa", product_type: "Pre-roll", thc: 22, cbd: 0.1, description: "A sweet, strawberry-flavored sativa with a bright, uplifting, and social character.", effects: ["Uplifted", "Social", "Energetic", "Happy"], flavor: ["Strawberry", "Sweet", "Berry"], aroma: ["Strawberry", "Sweet", "Earthy"], terpenes: [t("limonene", 32), t("myrcene", 26), t("pinene", 20), t("caryophyllene", 14), t("ocimene", 8)] },
  { id: "super-lemon-haze", name: "Super Lemon Haze", brand: "Bare Labs", strain: "Sativa-dominant Hybrid", product_type: "Vape", thc: 23, cbd: 0.1, description: "A zesty, lemon-forward hybrid with a bright, energetic, and uplifting character.", effects: ["Energetic", "Uplifted", "Creative", "Happy"], flavor: ["Lemon", "Citrus", "Sweet"], aroma: ["Lemon", "Citrus", "Sweet"], terpenes: [t("limonene", 44), t("myrcene", 22), t("caryophyllene", 16), t("pinene", 10), t("terpinolene", 8)] },
  { id: "lemon-skunk", name: "Lemon Skunk", brand: "Bare Labs", strain: "Hybrid", product_type: "Flower", thc: 21, cbd: 0.1, description: "A pungent, lemon-skunk hybrid with an energetic, euphoric, and creative character.", effects: ["Energetic", "Euphoric", "Creative", "Happy"], flavor: ["Lemon", "Skunky", "Earthy"], aroma: ["Lemon", "Skunky", "Citrus"], terpenes: [t("limonene", 38), t("myrcene", 24), t("caryophyllene", 18), t("humulene", 12), t("pinene", 8)] },
  { id: "forbidden-fruit", name: "Forbidden Fruit", brand: "Maison Verde", strain: "Indica-dominant Hybrid", product_type: "Flower", thc: 24, cbd: 0.1, description: "A tropical, citrus-and-berries indica hybrid with a calm, deeply relaxing character.", effects: ["Relaxed", "Calm", "Happy", "Sleepy"], flavor: ["Tropical", "Citrus", "Berry"], aroma: ["Citrus", "Tropical", "Sweet"], terpenes: [t("myrcene", 34), t("limonene", 28), t("linalool", 18), t("caryophyllene", 12), t("pinene", 8)] },
  { id: "tahoe-og", name: "Tahoe OG", brand: "The Reserve", strain: "Indica-dominant Hybrid", product_type: "Flower", thc: 26, cbd: 0.1, description: "A potent, earthy-lemon indica hybrid with a heavy, relaxing, and sedating character.", effects: ["Relaxed", "Sleepy", "Euphoric", "Calm"], flavor: ["Earthy", "Lemon", "Pine"], aroma: ["Earthy", "Lemon", "Pine"], terpenes: [t("myrcene", 36), t("limonene", 24), t("caryophyllene", 20), t("linalool", 12), t("humulene", 8)] },
  { id: "master-kush", name: "Master Kush", brand: "Legacy Co.", strain: "Indica", product_type: "Flower", thc: 22, cbd: 0.1, description: "A classic indica with earthy, citrus notes and a calm, grounded, relaxing character.", effects: ["Relaxed", "Calm", "Sleepy", "Happy"], flavor: ["Earthy", "Citrus", "Spice"], aroma: ["Earthy", "Citrus", "Spice"], terpenes: [t("myrcene", 38), t("caryophyllene", 24), t("limonene", 18), t("humulene", 12), t("pinene", 8)] },
  { id: "yuzu-fizz", name: "Yuzu Fizz", brand: "Saplings Beverages", strain: "Sativa-leaning", product_type: "Beverage", thc: 5, cbd: 5, description: "A sparkling beverage infused with citrus terpenes — a light, social, low-dose option.", effects: ["Uplifted", "Social", "Calm", "Happy"], flavor: ["Yuzu", "Citrus", "Sparkling"], aroma: ["Citrus", "Sweet", "Floral"], terpenes: [t("limonene", 40), t("ocimene", 24), t("pinene", 18), t("linalool", 12), t("myrcene", 6)] },
  { id: "midnight-mango", name: "Midnight Mango", brand: "Saplings Beverages", strain: "Indica-leaning", product_type: "Edible", thc: 10, cbd: 2, description: "A mango-forward edible gummy with a calming, evening-leaning character.", effects: ["Relaxed", "Calm", "Sleepy", "Happy"], flavor: ["Mango", "Tropical", "Sweet"], aroma: ["Mango", "Tropical", "Sweet"], terpenes: [t("myrcene", 42), t("limonene", 22), t("linalool", 18), t("caryophyllene", 12), t("ocimene", 6)] },
];

export const STORES = [
  { id: "store-1", name: "Verde Market", location: "Downtown", address: "210 W Oak St", distance: 1.2 },
  { id: "store-2", name: "The Green Room", location: "Eastside", address: "88 Summit Ave", distance: 2.6 },
  { id: "store-3", name: "Cascadia Provisions", location: "Riverside", address: "1450 River Rd", distance: 3.8 },
  { id: "store-4", name: "Nightingale Dispensary", location: "Midtown", address: "9 Midtown Plaza", distance: 4.5 },
  { id: "store-5", name: "Harbor Botanicals", location: "Waterfront", address: "3 Harbor Way", distance: 5.1 },
  { id: "store-6", name: "Sunset Provisions", location: "West End", address: "760 Sunset Blvd", distance: 6.4 },
];

export const DEALS = [
  { id: "deal-1", product_id: "gelato", store_id: "store-1", regular_price: 55, sale_price: 44, discount: 20, expiration: "2026-10-12", reason: "Similar to 3 products you've rated highly." },
  { id: "deal-2", product_id: "sunset-sherbet", store_id: "store-2", regular_price: 48, sale_price: 38, discount: 21, expiration: "2026-10-15", reason: "Matches your preference for citrus-forward, uplifting profiles." },
  { id: "deal-3", product_id: "super-lemon-haze", store_id: "store-3", regular_price: 60, sale_price: 45, discount: 25, expiration: "2026-10-09", reason: "High limonene content — a terpene you consistently rate above average." },
  { id: "deal-4", product_id: "midnight-mango", store_id: "store-4", regular_price: 24, sale_price: 19, discount: 21, expiration: "2026-10-20", reason: "A calming, evening-leaning option matching your nighttime preferences." },
  { id: "deal-5", product_id: "strawberry-cough", store_id: "store-1", regular_price: 42, sale_price: 34, discount: 19, expiration: "2026-10-18", reason: "Uplifting and social — effects you've logged enjoying during the day." },
  { id: "deal-6", product_id: "forbidden-fruit", store_id: "store-5", regular_price: 52, sale_price: 41, discount: 21, expiration: "2026-10-14", reason: "Shares linalool + limonene with two of your favorites." },
];

export const POSITIVE_EFFECTS = ["Relaxed", "Happy", "Euphoric", "Uplifted", "Creative", "Focused", "Energetic", "Sleepy", "Calm", "Hungry", "Social"];
export const NEGATIVE_EFFECTS = ["Anxious", "Dizzy", "Dry mouth", "Groggy", "Too sedating", "Headache", "Other"];
export const PRODUCT_TYPES = ["Flower", "Pre-roll", "Vape", "Concentrate", "Edible", "Tincture", "Beverage", "Other"];
export const INTERESTS = ["Finding products I like", "Understanding terpenes", "Tracking what I've tried", "Finding deals", "Discovering new products"];

export const terpeneById = (id) => TERPENES.find((x) => x.id === id);
export const productById = (id) => PRODUCTS.find((x) => x.id === id);
export const productByName = (name) => PRODUCTS.find((x) => x.name.toLowerCase() === (name || "").toLowerCase());
export const productsWithTerpene = (id) =>
  PRODUCTS.filter((p) => p.terpenes.some((x) => x.id === id)).sort(
    (a, b) => (b.terpenes.find((x) => x.id === id)?.pct || 0) - (a.terpenes.find((x) => x.id === id)?.pct || 0)
  );
