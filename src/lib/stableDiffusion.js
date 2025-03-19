import fs from 'fs';
import path from 'path';
import axios from 'axios';

export async function generateStagedImage(inputImage, roomStyle) {
  // Read and encode the image
  // const imageBuffer = fs.readFileSync(inputImagePath);
  const base64Image = inputImage.toString('base64');
  
  const promptMap = {
    modern: "Modify the given room image into a professional photo of a modern furnished living room with clean lines, neutral colors, and minimal decor",
    minimalist: "Modify the given room image into a professional photo of a minimalist furnished living room with essential furniture only, neutral colors, and clean aesthetic",
    scandinavian: "Modify the given room image into a professional photo of a scandinavian style living room with light wood, white walls, cozy textiles, and functional furniture",
    industrial: "Modify the given room image into a professional photo of an industrial style living room with exposed brick, metal accents, and vintage furniture",
    bohemian: "Modify the given room image into a professional photo of a bohemian style living room with colorful textiles, plants, eclectic furniture, and layered rugs",
    traditional: "Modify the given room image into a professional photo of a traditional style living room with classic furniture, rich colors, symmetrical arrangement, and elegant decor"
  };
  
  const prompt = promptMap[roomStyle] || promptMap.modern;
  
  try {
    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
    if (!REPLICATE_API_TOKEN) {
      throw new Error("REPLICATE_API_TOKEN environment variable is not set");
    }
    
    // First, create a prediction
    const response = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: "be04660a5b93ef2aff61e3668dedb4cbeb14941e62a3fd5998364a32d613e35e", // SDXL model ID
        input: {
          prompt: prompt,
          image: `data:image/jpeg;base64,${base64Image}`,
          strength: 0.20,
          guidance_scale: 7.5,
          negative_prompt: "blurry, poor quality, distorted, unrealistic"
        }
      },
      {
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const predictionId = response.data.id;
    console.log(`Prediction created with ID: ${predictionId}`);
    
    // Poll for the result
    let result = null;
    while (!result) {
      const statusResponse = await axios.get(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            'Authorization': `Token ${REPLICATE_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const prediction = statusResponse.data;
      
      if (prediction.status === 'succeeded') {
        result = prediction.output;
        break;
      } else if (prediction.status === 'failed') {
        throw new Error(`Prediction failed: ${prediction.error}`);
      }
      
      // Wait before polling again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Download the image
    const imageUrl = result[0]; // Assuming the output is an array with the image URL as first element
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    
    // // Save the image
    // const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    // if (!fs.existsSync(uploadsDir)) {
    //   fs.mkdirSync(uploadsDir, { recursive: true });
    // }
    
    // const timestamp = Date.now();
    // const outputPath = path.join(uploadsDir, `staged-${timestamp}.jpg`);
    // fs.writeFileSync(outputPath, Buffer.from(imageResponse.data));
    
    // Convert the binary data to a Base64 string and prepend the data URI prefix
    const base64ImageData = Buffer.from(imageResponse.data).toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64ImageData}`;

    // Return the data URI directly
    return dataUri;
    
    
  } catch (error) {
    console.error('Error generating with Replicate API:', error);
    throw new Error(`Failed to generate with Replicate: ${error.message}`);
  }
}