import { connectDB } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const filter = searchParams.get("filter") || "all"

    if (!query) {
      return Response.json([], {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      })
    }

    const db = await connectDB()
    const plantsCollection = db.collection("plants")

    // Build MongoDB search query
    let searchQuery: any = {}

    if (filter === "name") {
      searchQuery = {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { scientificName: { $regex: query, $options: "i" } },
          { tagalogName: { $regex: query, $options: "i" } },
        ],
      }
    } else if (filter === "uses") {
      searchQuery = {
        uses: { $regex: query, $options: "i" },
      }
    } else {
      // Search all fields
      searchQuery = {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { scientificName: { $regex: query, $options: "i" } },
          { tagalogName: { $regex: query, $options: "i" } },
          { uses: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      }
    }

    const results = await plantsCollection.find(searchQuery).toArray()

    return Response.json(results, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error) {
    console.error("[v0] Search error:", error)
    return Response.json({ error: "Search failed" }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
