import { GoogleGenAI, Modality } from "@google/genai";

// This file uses the client-side Gemini API.
// It assumes the API_KEY is available as an environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

/**
 * Converts a base64 data URL into an object compatible with the Gemini API.
 * @param dataUrl The base64 data URL (e.g., "data:image/png;base64,...").
 * @returns An object with inlineData for the Gemini API.
 */
const dataUrlToGenaiPart = (dataUrl: string) => {
  const match = dataUrl.match(/^data:(.*);base64,(.*)$/);
  if (!match) {
    throw new Error("Invalid data URL format");
  }
  const [, mimeType, data] = match;
  return {
    inlineData: {
      mimeType,
      data,
    },
  };
};

/**
 * Sends an image to the Gemini API to be restored using the Nano Banana model.
 * @param imageBase64 The base64 encoded image data URL.
 * @returns A base64 encoded data URL of the restored image, or null if not found.
 */
export const restoreImage = async (imageBase64: string): Promise<string | null> => {
  const imagePart = dataUrlToGenaiPart(imageBase64);

  const textPart = {
    text: "Objective: Radically transform the attached old photograph from a faded memory into a vibrant, ultra-realistic, and emotionally resonant modern image. The goal is not just to colorize, but to bring the scene and its subjects to life.\nGuiding Philosophy: From a Faded Memory to a Vivid Moment\nThis is the most important instruction: Transcend the limitations of the original photograph. Do not simply apply a simple color tint or a monochromatic wash (like sepia or orange). Instead, intelligently re-imagine the scene in full, vibrant, and deep color, as if it were originally captured with a professional modern digital camera. The final image must feel alive, present, and three-dimensional.\nCore Instructions:\nRestore Masterfully: Repair all physical and age-related damage—scratches, stains, creases, noise, and faded areas—to pristine condition. Sharpen details to achieve crisp clarity, especially in the eyes and textures, but avoid any artificial, over-processed look. Reconstruct any minor missing parts with perfect photorealism.\nColorize with Life and Depth: Infuse the image with a rich, dynamic, and full-spectrum color palette. The goal is maximum realism.\nRealistic Skin Tones: This is critical. Render skin with complex, multi-tonal depth, showing natural undertones, subtle blushes, and realistic highlights. Avoid flat, single-color, or \"plastic-like\" skin at all costs.\nVibrant Environment: Make informed, logical choices for the colors of clothing, objects, and the background. The colors should be plausible for the context but rendered with the richness and vibrancy of a modern photograph to make the entire scene pop.\nCrucial Constraints (What to Preserve at All Costs):\nDo Not Alter Identity: It is absolutely essential that you DO NOT change the facial features, bone structure, unique expressions, or physical characteristics of the people. The likeness must be 100% preserved.\nPreserve the Original Composition: Do not add, remove, or change the position of any people, objects, or background elements. The restored photo must be a perfect compositional match to the original.\nNo Unnatural Effects: Do not add stylistic filters, artificial vignettes, or exaggerated blur. The final image must look like a genuine, high-quality photograph.\nDesired Quality and Style:\nHyper-Realistic: The final image must be indistinguishable from a modern, professionally taken photograph.\nDynamic Lighting: While preserving the original light sources and shadows, enhance them to create a stronger sense of depth, contrast, and dimension. The lighting should feel active, not flat.\nHigh-Resolution Output: The result must be high-resolution, sharp, and suitable for high-quality printing.\nFinal Check:\nThe output should be a flawless, vibrant, and lifelike color photograph that is 100% faithful to the subjects and the composition of the original image, making an old moment feel powerfully present and real"
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: {
      parts: [imagePart, textPart],
    },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  // Find the restored image in the response parts
  // Use optional chaining for safety
  const parts = response.candidates?.[0]?.content?.parts;
  if (parts) {
    for (const part of parts) {
      if (part.inlineData) {
        const { mimeType, data } = part.inlineData;
        return `data:${mimeType};base64,${data}`;
      }
    }
  }

  // If no image part is found (e.g., blocked by safety settings), return null.
  return null;
};