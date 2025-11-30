import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DB_NAME = "medicinal_plants_db"
const COLLECTION_NAME = "plants"

const plantsData = [
  {
    name: "Sambong",
    scientificName: "Blumea balsamifera",
    tagalogName: "Sambong",
    family: "Asteraceae",
    genus: "Blumea",
    category: ["Diuretic", "Respiratory"],
    uses: [
      "Treatment of kidney stones and urinary tract infections",
      "Expectorant for cough and colds",
      "Reduces inflammation of the urinary system",
      "Helps eliminate excess body fluids",
    ],
    description:
      "Sambong is a woody shrub native to the Philippines, widely used in traditional medicine for its diuretic properties. The plant is known for its effectiveness in treating kidney stones and urinary system disorders.",
    activeCompounds: ["Essential oils", "Borneol", "Camphor", "Flavonoids"],
    preparation: [
      "Decoction: Boil 15-20 leaves in 1 liter of water for 15 minutes",
      "Tea: Steep dried leaves in hot water for 5-10 minutes",
      "Tincture: Soak leaves in alcohol for 2-3 weeks",
    ],
    precautions: [
      "Not recommended for pregnant women",
      "Avoid excessive consumption",
      "May interact with certain medications",
    ],
    image: "/sambong-blumea-balsamifera.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Lagundi",
    scientificName: "Vitex negundo",
    tagalogName: "Lagundi",
    family: "Lamiaceae",
    genus: "Vitex",
    category: ["Respiratory", "Anti-inflammatory"],
    uses: [
      "Treatment of cough and asthma",
      "Relief of sore throat",
      "Anti-inflammatory for respiratory conditions",
      "Fever reduction",
    ],
    description:
      "Lagundi is a fast-growing shrub with medicinal leaves used extensively in Filipino traditional medicine. It is particularly valued for treating cough, asthma, and other respiratory conditions.",
    activeCompounds: ["Iridoid glycosides", "Flavonoids", "Essential oils"],
    preparation: [
      "Decoction: Boil 10-15 fresh leaves in water",
      "Syrup: Make a decoction and add honey",
      "Inhalation: Boil leaves and inhale the steam",
    ],
    precautions: ["Consult doctor if symptoms persist", "May cause drowsiness in some individuals"],
    image: "/lagundi-vitex-negundo.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Peppermint",
    scientificName: "Mentha piperita",
    tagalogName: "Bulaklak ng Peppermint",
    family: "Lamiaceae",
    genus: "Mentha",
    category: ["Digestive", "Analgesic"],
    uses: [
      "Relief of indigestion and stomach upset",
      "Headache and migraine relief",
      "Cooling and refreshing properties",
      "Improvement of digestive function",
    ],
    description:
      "Peppermint is a hybrid mint plant known for its cooling flavor and medicinal properties. It has been used for centuries to treat digestive issues and provide relief from headaches.",
    activeCompounds: ["Menthol", "Menthone", "Essential oils"],
    preparation: [
      "Tea: Steep fresh or dried leaves in hot water",
      "Oil: Extract essential oil from leaves",
      "Fresh leaves: Chew or use in cooking",
    ],
    precautions: ["May cause allergic reactions in sensitive individuals", "Avoid excessive use during pregnancy"],
    image: "/peppermint-mentha-piperita.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Ginger",
    scientificName: "Zingiber officinale",
    tagalogName: "Luy-a",
    family: "Zingiberaceae",
    genus: "Zingiber",
    category: ["Digestive", "Anti-inflammatory", "Anti-nausea"],
    uses: [
      "Relief of nausea and vomiting",
      "Anti-inflammatory for arthritis",
      "Improvement of blood circulation",
      "Digestive aid and warming tonic",
    ],
    description:
      "Ginger is a rhizomatous plant widely used in Filipino cuisine and traditional medicine. Its warming properties and anti-inflammatory compounds make it valuable for various health conditions.",
    activeCompounds: ["Gingerol", "Shogaol", "Essential oils", "Sesquiterpenes"],
    preparation: [
      "Tea: Simmer fresh ginger slices in water",
      "Decoction: Boil ginger root for 10-15 minutes",
      "Tincture: Soak fresh ginger in alcohol",
    ],
    precautions: ["May increase bleeding risk in high doses", "Consult doctor if on blood thinners"],
    image: "/ginger-zingiber-officinale.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Turmeric",
    scientificName: "Curcuma longa",
    tagalogName: "Luyang Dilaw",
    family: "Zingiberaceae",
    genus: "Curcuma",
    category: ["Anti-inflammatory", "Antioxidant", "Digestive"],
    uses: [
      "Anti-inflammatory for joint pain and arthritis",
      "Liver support and detoxification",
      "Antioxidant and anti-cancer properties",
      "Digestive and anti-spasmodic benefits",
    ],
    description:
      "Turmeric is a golden rhizome widely used in Filipino traditional medicine and cooking. Its active compound, curcumin, has been extensively studied for its powerful anti-inflammatory and antioxidant properties.",
    activeCompounds: ["Curcumin", "Turmerone", "Essential oils", "Flavonoids"],
    preparation: [
      "Golden milk: Mix turmeric powder with milk and honey",
      "Decoction: Boil fresh turmeric root in water",
      "Paste: Make a paste for topical application",
    ],
    precautions: [
      "May interfere with blood clotting",
      "Consult doctor if on anticoagulants",
      "May cause gallstone issues in sensitive individuals",
    ],
    image: "/turmeric-curcuma-longa.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Aloe Vera",
    scientificName: "Aloe barbadensis",
    tagalogName: "Sabila",
    family: "Asphodelaceae",
    genus: "Aloe",
    category: ["Skin Care", "Digestive", "Laxative"],
    uses: [
      "Healing of wounds and burns",
      "Moisturizing and soothing irritated skin",
      "Gentle laxative for constipation",
      "Anti-inflammatory for digestive issues",
    ],
    description:
      "Aloe vera is a succulent plant widely cultivated in the Philippines. Both the gel and latex have medicinal properties used for treating skin conditions and supporting digestive health.",
    activeCompounds: ["Polysaccharides", "Anthraquinones", "Vitamins", "Minerals"],
    preparation: [
      "Gel: Extract fresh gel from leaves",
      "Topical: Apply directly to affected areas",
      "Juice: Dilute gel in water for internal use",
    ],
    precautions: [
      "Latex can be toxic - use gel only",
      "Avoid excessive internal consumption",
      "May cause allergic reactions in sensitive individuals",
    ],
    image: "/aloe-vera-aloe-barbadensis.jpg",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db(DB_NAME)
    const collection = db.collection(COLLECTION_NAME)

    // Check if collection already has data
    const existingCount = await collection.countDocuments()

    if (existingCount > 0) {
      console.log(`Collection already contains ${existingCount} plants. Skipping seed.`)
      return
    }

    // Insert seed data
    const result = await collection.insertMany(plantsData)
    console.log(`Successfully seeded ${Object.keys(result.insertedIds).length} plants into the database`)
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  } finally {
    await client.close()
    console.log("Disconnected from MongoDB")
  }
}

// Run seed if executed directly
seedDatabase()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
