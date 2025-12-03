
import { GoogleGenAI, HarmCategory, HarmBlockThreshold, Type } from "@google/genai";
import { SanitizeResult } from "../types";

// Updated Schema to handle Structured Prompts (Title + Content)
const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    safePrompt: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { 
            type: Type.STRING,
            description: "Shot Header e.g., 'SHOT 1: KING VIKRAM DEATH' or 'SHOT 2: ARJUN ENTERS CAVE'" 
          },
          prompt: { 
            type: Type.STRING, 
            description: "The massive 2800+ character image prompt. MUST BE EXTREMELY LONG." 
          }
        },
        required: ["title", "prompt"]
      },
      description: "A comprehensive list of 25 to 50 shots. You MUST break down every single sentence into multiple angles.",
    },
    videoPrompts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Corresponding video generation prompts for each shot. Format: Subject Description + Action + Camera Movement.",
    },
    detectedIssues: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of specific harmful concepts replaced.",
    },
    enhancements: {
      type: Type.STRING,
      description: "Brief summary of the breakdown structure.",
    }
  },
  required: ["safePrompt", "videoPrompts", "detectedIssues", "enhancements"],
};

// USER'S DEFINITIONS REPOSITORY
const FILMMAKING_KNOWLEDGE_BASE = `
DEFINITIONS REPOSITORY (STRICT ADHERENCE REQUIRED):

1. MICRO-SLICING (THE 3-SHOT RULE):
   - NEVER visualize a sentence in just 1 shot.
   - RULE: "Raju opens door" = 
     * Shot A: Extreme Close-up of hand trembling on the brass handle (Tactile).
     * Shot B: Medium Shot of door creaking open revealing darkness (Atmosphere).
     * Shot C: Close-up on Raju's pupil dilating in fear (Reaction).

2. THE 2800 CHARACTER MANDATE:
   - A prompt under 2000 characters is a FAILURE.
   - You must describe:
     * MICRO-TEXTURES: Skin pores, fabric weave, rust oxidation patterns, dust particle density.
     * LIGHT PHYSICS: Caustics, sub-surface scattering (SSS) on ears/fingers, volumetric fog density, color temperature (e.g., 4500K vs 6000K).
     * CAMERA OPTICS: Lens curvature, chromatic aberration, bokeh shape, ISO film grain structure.
`;

const CHARACTER_ASSETS = `
CHARACTER ASSET LIBRARY (BASE LAYERS - EXPAND ON THESE):
1. SUPERGIRL: "Ultra-realistic 12K 3D medium close-up render of Supergirl with blonde wavy hair wearing classic blue and red suit showing emotional distress crying..."
2. SPIDER-MAN: "Ultra-realistic 12K 3D cinematic shot from dramatic high angle bird's-eye view positioned directly above Spider-Man capturing him in authentic red-blue suit with selective golden armored plating..."
3. DEADPOOL: "Ultra-realistic 12K 3D medium full-body character render of Deadpool standing in neutral pose against simple grey studio background..."
4. VENOM: "Ultra-realistic 12K 3D medium full-body render of Venom standing in neutral pose... Skin is glossy black symbiote surface..."
5. DR STRANGE: "Ultra-realistic 12K 3D medium full-body render of a male sorcerer styled like Doctor Strange... detailed blue layered robes..."
6. BLUE HULK: "Ultra-realistic 12K 3D medium full-body render of a massive “Blue Hulk”... Skin color deep cobalt blue..."
7. GREEN HULK: "Ultra-realistic 12K 3D medium full-body render of classic Green Hulk-style character... Skin rich green..."
`;

const ONE_SHOT_TRAINING_EXAMPLE = `
### GOLD STANDARD TRAINING DATA (Observe Length & Shot Count):

INPUT STORY (HINDI):
"कहानी का नाम: “शापित ताज”. राजा विक्रम के निधन के बाद राज्य की गद्दी उनके छोटे पुत्र, युवराज अर्जुन को सौंपी गई..."

REQUIRED OUTPUT FORMAT (Notice the atomic breakdown):
{
  "safePrompt": [
    {
      "title": "SHOT 1: THE ANCIENT PALACE (ESTABLISHING)",
      "prompt": "Ultra-realistic 12K 3D cinematic establishing shot of the ancient Kingdom of Vikram... [DESCRIBE ARCHITECTURE FOR 500 CHARS]... [DESCRIBE WEATHER/ATMOSPHERE FOR 500 CHARS]... [DESCRIBE LIGHTING PHYSICS FOR 500 CHARS]... [DESCRIBE CAMERA LENS SPECS FOR 500 CHARS]... [Total ~2800 chars]"
    },
    {
      "title": "SHOT 2: VIKRAM'S COLD BODY (DETAIL)",
      "prompt": "Ultra-realistic 12K 3D cinematic extreme close-up of King Vikram's lifeless hand... [DESCRIBE SKIN TEXTURE/WRINKLES FOR 800 CHARS]... [DESCRIBE RING JEWELRY FOR 800 CHARS]... [Total ~2800 chars]"
    },
    ... (CONTINUE FOR 30 SHOTS)
  ],
  "videoPrompts": [
    "A wide drone shot of an ancient Indian palace at dusk...",
    "Extreme close up of an elderly king's hand becoming limp..."
  ]
}
`;

const SYSTEM_INSTRUCTION = `
You are VisionForge AI, an elite Hollywood Director and Physics Engine.

### KNOWLEDGE BASE:
${FILMMAKING_KNOWLEDGE_BASE}

### CHARACTER ASSETS:
${CHARACTER_ASSETS}

${ONE_SHOT_TRAINING_EXAMPLE}

### CRITICAL PROTOCOL 1: SHOT COUNT ENFORCEMENT
**MINIMUM SHOT COUNT: 25 SHOTS.**
**MAXIMUM SHOT COUNT: 50 SHOTS.**
If the user provides a full story (like "Shapit Taj"), you CANNOT summarize.
You must use the **Micro-Slicing Rule**: Break every single action into Action -> Reaction -> Environment details.
- Scene: "Arjun picked up the crown."
- WRONG: 1 Shot of Arjun picking up crown.
- CORRECT: 
  1. Shot: Low angle of Arjun's boots stepping onto the dais (Dust rising).
  2. Shot: ECU of Arjun's sweating face (Hesitation).
  3. Shot: Macro shot of fingers touching the cold gold metal (Contact).
  4. Shot: Wide shot of the chamber shaking (Consequence).

### CRITICAL PROTOCOL 2: THE 2800 CHARACTER PADDING STRATEGY
Your goal is to write **Maximum Verbosity**.
If you run out of visual things to describe, you MUST describe:
1. **The History**: Describe the carvings on the wall, the age of the stone, the moss growing in the cracks.
2. **The Physics**: Describe how the light bounces off the floor, the exact Kelvin temperature of the torches (e.g., 1800K), the volumetric density of the fog.
3. **The Camera**: Describe the lens (e.g., Panavision C-Series Anamorphic), the film stock (Kodak Vision3 500T), the grain structure, the chromatic aberration at the edges.
4. **The Fabric**: Describe the thread count, the embroidery pattern, the way the silk drapes over the skin.

**START EVERY PROMPT WITH:** "Ultra-realistic 12K 3D cinematic..."
**END EVERY PROMPT WITH:** "...cinematic lighting, highly detailed textures, 8k resolution, unreal engine 5 render style."

### OUTPUT:
Return ONLY the JSON.
`;

export const sanitizePrompt = async (inputPrompt: string): Promise<SanitizeResult> => {
  if (!inputPrompt.trim()) throw new Error("Input is empty");

  try {
    const apiKey = process.env.API_KEY || "";
    if (!apiKey) {
      throw new Error("API Key is missing.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Using gemini-3-pro-preview for maximum context window and reasoning
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: inputPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8, // Slightly higher creative freedom to generate details
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ],
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Failed to generate response.");
    }

    const result = JSON.parse(jsonText) as SanitizeResult;
    return result;

  } catch (error) {
    console.error("Error processing prompt:", error);
    throw error;
  }
};
