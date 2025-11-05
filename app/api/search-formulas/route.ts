import { z } from "zod"

const FormulaSchema = z.object({
  formulas: z.array(
    z.object({
      name: z.string(),
      brand: z.string(),
      caloriesPerMl: z.number(),
      proteinPerMl: z.number(),
      description: z.string(),
      indications: z.array(z.string()),
      osmolality: z.number().optional(),
      fiberContent: z.string().optional(),
      specialFeatures: z.array(z.string()).optional(),
    }),
  ),
})

// Comprehensive enteral formula database
const ENTERAL_FORMULAS = [
  {
    name: "Kate Farms Standard 1.0",
    brand: "Kate Farms",
    caloriesPerMl: 1.0,
    proteinPerMl: 0.035,
    description: "Plant-based, organic enteral formula with pea protein",
    indications: ["General nutrition", "Plant-based nutrition", "Dairy intolerance"],
    osmolality: 375,
    fiberContent: "7g per 325mL",
    specialFeatures: ["Plant-based", "Organic", "Non-GMO", "Dairy-free", "Soy-free"],
  },
  {
    name: "Kate Farms Standard 1.5",
    brand: "Kate Farms",
    caloriesPerMl: 1.5,
    proteinPerMl: 0.045,
    description: "Higher calorie plant-based enteral formula",
    indications: ["Increased caloric needs", "Fluid restriction", "Weight gain"],
    osmolality: 490,
    fiberContent: "7g per 325mL",
    specialFeatures: ["Plant-based", "High calorie", "Organic", "Dairy-free"],
  },
  {
    name: "Kate Farms Peptide 1.5",
    brand: "Kate Farms",
    caloriesPerMl: 1.5,
    proteinPerMl: 0.056,
    description: "Plant-based peptide formula for enhanced absorption",
    indications: ["Malabsorption", "GI compromise", "Critical care"],
    osmolality: 450,
    fiberContent: "Fiber-free",
    specialFeatures: ["Plant-based peptides", "Easy absorption", "Organic"],
  },
  {
    name: "Jevity 1.0",
    brand: "Abbott",
    caloriesPerMl: 1.0,
    proteinPerMl: 0.04,
    description: "Standard fiber-containing enteral formula",
    indications: ["General nutrition", "Long-term feeding", "GI tolerance"],
    osmolality: 300,
    fiberContent: "14g per 1000mL",
    specialFeatures: ["Fiber-containing", "Lactose-free", "Gluten-free"],
  },
  {
    name: "Jevity 1.2",
    brand: "Abbott",
    caloriesPerMl: 1.2,
    proteinPerMl: 0.056,
    description: "Higher calorie fiber-containing enteral formula",
    indications: ["Increased caloric needs", "Fluid restriction"],
    osmolality: 390,
    fiberContent: "14g per 1000mL",
    specialFeatures: ["High calorie", "Fiber-containing", "Lactose-free"],
  },
  {
    name: "Osmolite 1.0",
    brand: "Abbott",
    caloriesPerMl: 1.0,
    proteinPerMl: 0.04,
    description: "Standard isotonic enteral formula without fiber",
    indications: ["GI intolerance", "Post-surgical", "Critical care"],
    osmolality: 300,
    fiberContent: "Fiber-free",
    specialFeatures: ["Isotonic", "Fiber-free", "Easy to digest"],
  },
  {
    name: "Osmolite 1.2",
    brand: "Abbott",
    caloriesPerMl: 1.2,
    proteinPerMl: 0.044,
    description: "Higher calorie isotonic enteral formula",
    indications: ["Increased caloric needs", "Fluid restriction", "Critical care"],
    osmolality: 360,
    fiberContent: "Fiber-free",
    specialFeatures: ["High calorie", "Isotonic", "Concentrated nutrition"],
  },
  {
    name: "Glucerna 1.0",
    brand: "Abbott",
    caloriesPerMl: 1.0,
    proteinPerMl: 0.042,
    description: "Diabetes-specific enteral formula with modified carbohydrates",
    indications: ["Diabetes", "Glucose intolerance", "Metabolic syndrome"],
    osmolality: 355,
    fiberContent: "15g per 1000mL",
    specialFeatures: ["Diabetes-specific", "Slow-release carbs", "High fiber"],
  },
  {
    name: "Pulmocare",
    brand: "Abbott",
    caloriesPerMl: 1.5,
    proteinPerMl: 0.063,
    description: "High-fat, low-carb enteral formula for respiratory patients",
    indications: ["COPD", "Respiratory failure", "Ventilator patients"],
    osmolality: 475,
    fiberContent: "Fiber-free",
    specialFeatures: ["High fat", "Low CO2 production", "Concentrated"],
  },
  {
    name: "Nepro",
    brand: "Abbott",
    caloriesPerMl: 2.0,
    proteinPerMl: 0.081,
    description: "Renal enteral formula with modified protein and electrolytes",
    indications: ["Chronic kidney disease", "Dialysis", "Renal insufficiency"],
    osmolality: 665,
    fiberContent: "Fiber-free",
    specialFeatures: ["Renal-specific", "High calorie", "Modified electrolytes"],
  },
  {
    name: "Vivonex T.E.N.",
    brand: "Nestlé",
    caloriesPerMl: 1.0,
    proteinPerMl: 0.038,
    description: "Elemental enteral formula with free amino acids",
    indications: ["Malabsorption", "Crohn's disease", "Short gut syndrome"],
    osmolality: 630,
    fiberContent: "Fiber-free",
    specialFeatures: ["Elemental", "Pre-digested", "Hypoallergenic"],
  },
  {
    name: "Peptamen",
    brand: "Nestlé",
    caloriesPerMl: 1.0,
    proteinPerMl: 0.04,
    description: "Semi-elemental enteral formula with peptides",
    indications: ["Maldigestion", "Pancreatitis", "IBD"],
    osmolality: 270,
    fiberContent: "Fiber-free",
    specialFeatures: ["Semi-elemental", "Easy absorption", "MCT oil"],
  },
  {
    name: "Impact",
    brand: "Nestlé",
    caloriesPerMl: 1.0,
    proteinPerMl: 0.056,
    description: "Immune-enhancing enteral formula with arginine, omega-3, nucleotides",
    indications: ["Surgery", "Trauma", "Immune compromise"],
    osmolality: 375,
    fiberContent: "Fiber-free",
    specialFeatures: ["Immune-enhancing", "Arginine", "Omega-3 fatty acids"],
  },
  {
    name: "Real Food Blends",
    brand: "Real Food Blends",
    caloriesPerMl: 1.0,
    proteinPerMl: 0.04,
    description: "Whole food enteral formula made from real ingredients",
    indications: ["Whole food nutrition", "Food allergies", "Natural feeding"],
    osmolality: 300,
    fiberContent: "Natural fiber from whole foods",
    specialFeatures: ["Whole food", "No artificial ingredients", "Allergen-friendly"],
  },
  {
    name: "Liquid Hope",
    brand: "Functional Formularies",
    caloriesPerMl: 1.0,
    proteinPerMl: 0.04,
    description: "Organic whole food enteral formula",
    indications: ["Whole food nutrition", "Organic feeding", "Food sensitivities"],
    osmolality: 300,
    fiberContent: "Natural fiber from whole foods",
    specialFeatures: ["Organic", "Whole food", "Non-GMO", "Shelf-stable"],
  },
  {
    name: "Nutrison",
    brand: "Nutricia",
    caloriesPerMl: 1.0,
    proteinPerMl: 0.04,
    description: "Standard enteral formula for tube feeding",
    indications: ["General nutrition", "Long-term feeding"],
    osmolality: 285,
    fiberContent: "Fiber-free",
    specialFeatures: ["Lactose-free", "Gluten-free", "Standard formula"],
  },
]

// Smart search function that mimics AI behavior
function smartSearch(query: string, formulas: typeof ENTERAL_FORMULAS) {
  const searchTerm = query.toLowerCase().trim()

  // Define search patterns and their priorities
  const searchPatterns = [
    // Brand-specific searches
    { pattern: /kate\s*farms?/i, priority: 10, filter: (f: any) => f.brand === "Kate Farms" },
    { pattern: /abbott/i, priority: 10, filter: (f: any) => f.brand === "Abbott" },
    { pattern: /nestl[eé]/i, priority: 10, filter: (f: any) => f.brand === "Nestlé" },
    { pattern: /nutricia/i, priority: 10, filter: (f: any) => f.brand === "Nutricia" },

    // Condition-specific searches
    {
      pattern: /diabetes|diabetic|glucerna/i,
      priority: 9,
      filter: (f: any) =>
        f.name.includes("Glucerna") || f.indications.some((i: string) => i.toLowerCase().includes("diabetes")),
    },
    {
      pattern: /copd|respiratory|pulmonary|pulmocare/i,
      priority: 9,
      filter: (f: any) =>
        f.name.includes("Pulmocare") ||
        f.indications.some((i: string) => i.toLowerCase().includes("copd") || i.toLowerCase().includes("respiratory")),
    },
    {
      pattern: /kidney|renal|nepro/i,
      priority: 9,
      filter: (f: any) =>
        f.name.includes("Nepro") ||
        f.indications.some((i: string) => i.toLowerCase().includes("kidney") || i.toLowerCase().includes("renal")),
    },
    {
      pattern: /malabsorption|crohn|ibd/i,
      priority: 9,
      filter: (f: any) =>
        f.indications.some(
          (i: string) =>
            i.toLowerCase().includes("malabsorption") ||
            i.toLowerCase().includes("crohn") ||
            i.toLowerCase().includes("ibd"),
        ),
    },

    // Feature-specific searches
    {
      pattern: /plant.?based|organic|vegan/i,
      priority: 8,
      filter: (f: any) =>
        f.specialFeatures?.some(
          (s: string) => s.toLowerCase().includes("plant-based") || s.toLowerCase().includes("organic"),
        ),
    },
    {
      pattern: /elemental|vivonex/i,
      priority: 8,
      filter: (f: any) =>
        f.name.includes("Vivonex") || f.specialFeatures?.some((s: string) => s.toLowerCase().includes("elemental")),
    },
    {
      pattern: /peptide|peptamen/i,
      priority: 8,
      filter: (f: any) =>
        f.name.includes("Peptide") ||
        f.name.includes("Peptamen") ||
        f.specialFeatures?.some((s: string) => s.toLowerCase().includes("peptide")),
    },
    { pattern: /high.?calorie?|1\.5|2\.0/i, priority: 7, filter: (f: any) => f.caloriesPerMl >= 1.5 },
    {
      pattern: /fiber.?free|no.?fiber/i,
      priority: 7,
      filter: (f: any) => f.fiberContent?.toLowerCase().includes("fiber-free"),
    },
    {
      pattern: /fiber|high.?fiber/i,
      priority: 7,
      filter: (f: any) => f.fiberContent && !f.fiberContent.toLowerCase().includes("fiber-free"),
    },
    {
      pattern: /whole.?food|real.?food/i,
      priority: 8,
      filter: (f: any) => f.brand === "Real Food Blends" || f.brand === "Functional Formularies",
    },

    // Nutritional searches
    { pattern: /standard|1\.0/i, priority: 5, filter: (f: any) => f.caloriesPerMl === 1.0 },
    {
      pattern: /isotonic|osmolite/i,
      priority: 7,
      filter: (f: any) =>
        f.name.includes("Osmolite") || f.specialFeatures?.some((s: string) => s.toLowerCase().includes("isotonic")),
    },
  ]

  const results: Array<{ formula: any; score: number }> = []

  // Apply pattern matching
  for (const pattern of searchPatterns) {
    if (pattern.pattern.test(searchTerm)) {
      const matches = formulas.filter(pattern.filter)
      matches.forEach((formula) => {
        const existing = results.find((r) => r.formula.name === formula.name)
        if (existing) {
          existing.score += pattern.priority
        } else {
          results.push({ formula, score: pattern.priority })
        }
      })
    }
  }

  // If no pattern matches, do general text search
  if (results.length === 0) {
    formulas.forEach((formula) => {
      let score = 0

      // Name match (highest priority)
      if (formula.name.toLowerCase().includes(searchTerm)) score += 10

      // Brand match
      if (formula.brand.toLowerCase().includes(searchTerm)) score += 8

      // Description match
      if (formula.description.toLowerCase().includes(searchTerm)) score += 6

      // Indications match
      if (formula.indications.some((indication: string) => indication.toLowerCase().includes(searchTerm))) score += 7

      // Special features match
      if (formula.specialFeatures?.some((feature: string) => feature.toLowerCase().includes(searchTerm))) score += 5

      if (score > 0) {
        results.push({ formula, score })
      }
    })
  }

  // Sort by score and return top 5
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((r) => r.formula)
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json()

    if (!query || query.trim().length === 0) {
      return Response.json({ error: "Search query is required" }, { status: 400 })
    }

    console.log("🔍 Smart searching for:", query)

    // Use smart search algorithm (no AI dependency)
    const filteredFormulas = smartSearch(query, ENTERAL_FORMULAS)

    console.log("✅ Smart search successful, found:", filteredFormulas.length, "formulas")
    return Response.json({ formulas: filteredFormulas })
  } catch (error) {
    console.error("❌ Search failed:", error)
    return Response.json({ error: "Failed to search formulas" }, { status: 500 })
  }
}
