import { GoogleGenAI, Modality, Part } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToBase64 = (file: File): Promise<{mimeType: string, data: string}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error("Failed to read file as base64 string."));
      }
      const base64String = reader.result.split(',')[1];
      resolve({
        mimeType: file.type,
        data: base64String,
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};


const POSES = [
    "standing with hands on hips, full-body shot, fashion magazine style.",
    "walking towards the camera, three-quarters view, street style photography.",
    "leaning against a neutral wall, side profile, looking away from the camera.",
];

export const generateVirtualTryOnImages = async (
  personImageFile: File,
  clothingImageFile: File,
  updateLoadingMessage: (key: string, context?: Record<string, string | number>) => void
): Promise<string[]> => {
  
  updateLoadingMessage("converting");
  const [personImageData, clothingImageData] = await Promise.all([
    fileToBase64(personImageFile),
    fileToBase64(clothingImageFile),
  ]);

  const personImagePart: Part = {
      inlineData: {
          mimeType: personImageData.mimeType,
          data: personImageData.data
      }
  };

  const clothingImagePart: Part = {
      inlineData: {
          mimeType: clothingImageData.mimeType,
          data: clothingImageData.data
      }
  };

  const generationPromises = POSES.map(async (pose, index) => {
      updateLoadingMessage("generating", {
        index: index + 1,
        total: POSES.length,
        pose: pose.split(',')[0]
      });
      const prompt = `
        Task: Virtual Try-On.
        Reference Person Image (First Image): Use the person from this image as the model. It is absolutely crucial to preserve this person's original face, hair, body shape, and skin tone without any changes. Do not alter their identity or facial features in any way.
        Reference Clothing Image (Second Image): From this image, extract ONLY the clothing item. If there is a person, model, or mannequin in this image, completely ignore them and use only the garment.
        Instructions: Create a new, photorealistic image showing the reference person wearing the extracted clothing item. The person must be in the following pose: "${pose}". The clothing must adapt naturally to the person's body and the specified pose, with realistic folds, lighting, and shadows. The background should be a simple, light-colored studio setting.
      `;

      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image-preview',
          contents: {
              parts: [
                  personImagePart,
                  clothingImagePart,
                  { text: prompt },
              ],
          },
          config: {
              responseModalities: [Modality.IMAGE, Modality.TEXT],
          },
      });
      
      const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
      if (!imagePart || !imagePart.inlineData) {
          throw new Error(`Failed to generate image for pose ${index + 1}. The AI did not return an image.`);
      }
      return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
  });

  updateLoadingMessage("finalizing");
  const results = await Promise.all(generationPromises);
  return results;
};