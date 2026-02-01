import { connectDB } from '@/lib/db'
import { ObjectId } from 'mongodb'

// Mock database of Philippine medicinal plants
const plantsData = [
  {
    _id: "1",
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
  },
  {
    _id: "2",
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
  },
  {
    _id: "3",
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
  },
  {
    _id: "4",
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
  },
  {
    _id: "5",
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
  },
  {
    _id: "6",
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
  },
]

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const plant = plantsData.find(p => p._id === id)
  if (!plant) {
    return Response.json({ error: "Plant not found" }, { status: 404 })
  }
  return Response.json(plant)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await connectDB()
    const plantsCollection = db.collection("plants")

    const { id } = await params
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid ID")
    }
    const body = await request.json()
    const { _id, ...updateData } = body
    updateData.updatedAt = new Date()
    const queryId = new ObjectId(id)

    const result = await plantsCollection.updateOne(
      { _id: queryId },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return Response.json({ error: "Plant not found" }, {
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      })
    }

    // Fetch the updated plant
    const updatedPlant = await plantsCollection.findOne({ _id: queryId })

    return Response.json({ data: updatedPlant }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error) {
    console.error("Error updating plant in database:", error)
    // Fallback to mock data if database connection fails or invalid ID
    const { id } = await params
    const plantIndex = plantsData.findIndex(p => p._id === id)
    if (plantIndex === -1) {
      return Response.json({ error: "Plant not found" }, {
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      })
    }
    // Simulate update in mock data (note: this won't persist)
    const body = await request.json()
    const { _id, ...updateData } = body
    updateData.updatedAt = new Date()
    plantsData[plantIndex] = { ...plantsData[plantIndex], ...updateData }
    console.log("Simulated update in mock plant data for ID:", id)
    return Response.json({ data: plantsData[plantIndex] }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await connectDB()
    const plantsCollection = db.collection("plants")

    const { id } = await params
    const result = await plantsCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return Response.json({ error: "Plant not found" }, { status: 404 })
    }

    return Response.json({ message: "Plant deleted successfully" })
  } catch (error) {
    console.error("Error deleting plant from database:", error)
    // Fallback to mock data if database connection fails
    const { id } = await params
    const plantIndex = plantsData.findIndex(p => p._id === id)
    if (plantIndex === -1) {
      return Response.json({ error: "Plant not found" }, { status: 404 })
    }
    // Simulate deletion from mock data (note: this won't persist)
    plantsData.splice(plantIndex, 1)
    console.log("Simulated deletion from mock plant data for ID:", id)
    return Response.json({ message: "Plant deleted successfully" })
  }
}
