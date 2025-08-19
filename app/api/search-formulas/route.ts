import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
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

// Comprehensive enteral formula database - focused on tube feeding formulas only
const ENTERAL_FORMULAS = [
  // Kate Farms - Plant-based enteral formulas
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

  // Abbott Nutrition - Traditional enteral formulas
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

  // Nestlé Health Science - Enteral formulas
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

  // Real Food Blends - Whole food enteral formulas
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

  // Functional Formularies - Liquid Hope
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

  // Danone/Nutricia - Specialized enteral formulas
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

export async function POST(request: Request) {
  try {
    const { query } = await request.json()

    if (!query || query.trim().length === 0) {
      return Response.json({ error: "Search query is required" }, { status: 400 })
    }

    // Use AI to enhance the search and provide contextual information
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: FormulaSchema,
      prompt: `You are a clinical nutrition expert specializing in ENTERAL NUTRITION formulas for tube feeding. Based on the search query "${query}", find and return relevant enteral formulas from this database: ${JSON.stringify(ENTERAL_FORMULAS)}. 

      IMPORTANT: Only return formulas that are specifically designed for ENTERAL NUTRITION (tube feeding). Do not include oral supplements, protein powders, or other non-enteral products.

      Consider the following when matching:
      - Enteral formula names and brands (Kate Farms, Abbott, Nestlé, etc.)
      - Medical conditions/indications for tube feeding
      - Nutritional characteristics (calories, protein, fiber content)
      - Special features (plant-based, elemental, diabetes-specific, etc.)
      - Tube feeding applications (PEG, NG, G-tube, etc.)

      Return the most relevant ENTERAL formulas (up to 5) that match the search criteria. If the query mentions:
      - "plant-based" or "organic" - prioritize Kate Farms and whole food formulas
      - Specific conditions like diabetes, COPD, kidney disease - prioritize condition-specific enteral formulas
      - "elemental" or "peptide" - prioritize pre-digested enteral formulas
      - "fiber" - prioritize fiber-containing enteral formulas

      For each formula, ensure all nutritional data is accurate based on the provided database and that it's appropriate for tube feeding administration.`,
    })

    return Response.json(object)
  } catch (error) {
    console.error("Error searching formulas:", error)
    return Response.json({ error: "Failed to search formulas" }, { status: 500 })
  }
}
