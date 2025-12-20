import { Router, Request, Response } from "express";
import { HuggingFaceService } from "../services/huggingface";
import { TravelPlanRequest, TravelPlanResponse } from "../types/travel";

const router = Router();

// Generate travel plan endpoint
router.post("/plan", async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, destination, budget }: TravelPlanRequest =
      req.body;

    // Validation
    if (!startDate || !endDate || !destination || !budget) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: startDate, endDate, destination, budget",
      });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        error: "End date must be after start date",
      });
    }

    if (budget <= 0) {
      return res.status(400).json({
        success: false,
        error: "Budget must be greater than 0",
      });
    }

    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Create prompt for AI
    const prompt = `You are a travel planning expert. Create a detailed travel itinerary for ${destination} from ${startDate} to ${endDate} (${totalDays} days) with a budget of $${budget} USD.

IMPORTANT: Return ONLY valid JSON, no additional text before or after.

Requirements:
1. Create a day-by-day itinerary with 3-5 specific destinations/attractions per day
2. Each destination must include:
   - Title (name of the place/attraction)
   - Description (detailed description of what to see/do there, 2-3 sentences)
   - Coordinates (real latitude and longitude as numbers, accurate for ${destination})
   - Visit order (sequential number starting from 1)
   - Estimated duration (e.g., "2 hours", "Half day", "Full day")
   - Image URL (use a real image URL from Unsplash or similar: "https://images.unsplash.com/photo-..." or placeholder if not available)
   - Price (entry/admission price in local currency if applicable, null if free)
   - Ticket link (URL to buy tickets if applicable, null if not needed)
3. Include 2-3 hotel recommendations (as an array) with:
   - Hotel name (real or realistic hotel name in ${destination})
   - Description (2-3 sentences about the hotel)
   - Booking links (use format: "https://www.booking.com/hotel/...", "https://www.expedia.com/...", etc. or "N/A" if not available)
   - Estimated price per night in local currency (realistic for the destination and budget)
4. Determine the local currency based on the destination (e.g., EUR for Europe, GBP for UK, JPY for Japan, USD for US, etc.)
5. Calculate estimated total cost for the trip in local currency (should be close to but under the budget)
6. Include 5-8 restaurant recommendations in the area with:
   - Restaurant name
   - Description (2-3 sentences about the cuisine and atmosphere)
   - Cuisine type (e.g., "Italian", "French", "Asian Fusion")
   - Price range (e.g., "$", "$$", "$$$", "$$$$")
   - Coordinates (latitude and longitude)
   - Rating (1-5 stars)
   - Website URL (if available)
   - Image URL (if available)
7. Include 3-5 travel recommendations/tips as an array

Return the response as a valid JSON object with this EXACT structure (no markdown, no code blocks):
{
  "destination": "${destination}",
  "startDate": "${startDate}",
  "endDate": "${endDate}",
  "totalDays": ${totalDays},
  "budget": ${budget},
  "estimatedTotalCost": <number>,
  "currency": "<currency code like USD, EUR, GBP, JPY, etc.>",
  "itinerary": [
    {
      "title": "<destination name>",
      "description": "<detailed description>",
      "coordinates": {
        "latitude": <number>,
        "longitude": <number>
      },
      "visitOrder": <number>,
      "estimatedDuration": "<duration>",
      "imageUrl": "<image URL or null>",
      "price": <number or null>,
      "ticketLink": "<ticket URL or null>"
    }
  ],
  "hotels": [
    {
      "name": "<hotel name>",
      "description": "<hotel description>",
      "bookingLinks": {
        "booking": "<booking.com URL or N/A>",
        "expedia": "<expedia.com URL or N/A>",
        "agoda": "<agoda.com URL or N/A>",
        "hotels": "<hotels.com URL or N/A>"
      },
      "estimatedPrice": <number>
    }
  ],
  "selectedHotelIndex": 0,
  "restaurants": [
    {
      "name": "<restaurant name>",
      "description": "<restaurant description>",
      "cuisine": "<cuisine type>",
      "priceRange": "<$ or $$ or $$$ or $$$$>",
      "coordinates": {
        "latitude": <number>,
        "longitude": <number>
      },
      "rating": <number 1-5>,
      "website": "<website URL or null>",
      "imageUrl": "<image URL or null>"
    }
  ],
  "recommendations": ["<tip 1>", "<tip 2>", ...]
}

Make sure all coordinates are real and accurate for the locations in ${destination}. Return ONLY valid JSON, no additional text.`;

    // Call AI to generate travel plan using chat completion
    // Convert prompt to chat messages format
    const messages = [
      {
        role: "system" as const,
        content: "You are a travel planning expert. Create detailed travel itineraries in JSON format.",
      },
      {
        role: "user" as const,
        content: prompt,
      },
    ];

    // Try with a different model that's more reliable
    // Using meta-llama which is better supported
    const aiResponse = await HuggingFaceService.chatCompletion(
      messages,
      "meta-llama/Meta-Llama-3-8B-Instruct",
      {
        max_tokens: 4000, // Increased to handle larger responses with restaurants
        temperature: 0.7,
      }
    );

    // Parse AI response (should be JSON)
    let travelPlan;
    try {
      // Get content from chat completion response
      const content = aiResponse.content || "";
      let jsonString = content.trim();
      
      // Remove markdown code blocks if present
      jsonString = jsonString.replace(/```json\s*/g, "").replace(/```\s*/g, "");
      
      // Try to extract JSON object from response
      let jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
      }
      
      // Try to fix incomplete JSON
      try {
        travelPlan = JSON.parse(jsonString);
      } catch (parseError: any) {
        // If parsing fails, try to fix incomplete JSON
        console.log("Initial parse failed, attempting to fix JSON...");
        
        // Fix incomplete numbers in coordinates (e.g., "34.764" -> "34.764000")
        jsonString = jsonString.replace(/"longitude":\s*(\d+\.\d{1,5})(?=\s*[,\]}])/g, (match, num) => {
          const parts = num.split('.');
          if (parts[1] && parts[1].length < 6) {
            const padded = num + '0'.repeat(6 - parts[1].length);
            return `"longitude": ${padded}`;
          }
          return match;
        });
        
        jsonString = jsonString.replace(/"latitude":\s*(\d+\.\d{1,5})(?=\s*[,\]}])/g, (match, num) => {
          const parts = num.split('.');
          if (parts[1] && parts[1].length < 6) {
            const padded = num + '0'.repeat(6 - parts[1].length);
            return `"latitude": ${padded}`;
          }
          return match;
        });
        
        // Try to close incomplete arrays/objects
        const openBraces = (jsonString.match(/\{/g) || []).length;
        const closeBraces = (jsonString.match(/\}/g) || []).length;
        const openBrackets = (jsonString.match(/\[/g) || []).length;
        const closeBrackets = (jsonString.match(/\]/g) || []).length;
        
        // Add missing closing brackets
        if (openBrackets > closeBrackets) {
          jsonString += ']'.repeat(openBrackets - closeBrackets);
        }
        if (openBraces > closeBraces) {
          jsonString += '}'.repeat(openBraces - closeBraces);
        }
        
        // Try parsing again
        try {
          travelPlan = JSON.parse(jsonString);
        } catch (secondError: any) {
          // Last resort: try to extract what we can by finding the last complete restaurant object
          console.error("JSON parsing failed after fixes:", secondError.message);
          
          // Try to extract up to the last complete restaurant
          const restaurantsMatch = jsonString.match(/"restaurants":\s*\[([\s\S]*?)\]/);
          if (restaurantsMatch) {
            // Remove incomplete restaurants array and try again
            const beforeRestaurants = jsonString.substring(0, jsonString.indexOf('"restaurants"'));
            const fixedJson = beforeRestaurants + '"restaurants": []}';
            try {
              travelPlan = JSON.parse(fixedJson);
              travelPlan.restaurants = []; // Set empty array if we had to remove it
            } catch {
              throw new Error(
                `Failed to parse AI response. The response may be incomplete. ` +
                `Error: ${secondError.message}. ` +
                `Response preview: ${jsonString.substring(Math.max(0, jsonString.length - 500))}`
              );
            }
          } else {
            throw new Error(
              `Failed to parse AI response. The response may be incomplete. ` +
              `Error: ${secondError.message}. ` +
              `Response preview: ${jsonString.substring(Math.max(0, jsonString.length - 500))}`
            );
          }
        }
      }
      
      // Validate required fields
      if (!travelPlan.destination || !travelPlan.itinerary) {
        throw new Error("AI response missing required fields");
      }
      
      // Ensure itinerary is an array
      if (!Array.isArray(travelPlan.itinerary)) {
        throw new Error("Itinerary must be an array");
      }
      
      // Handle both old format (hotel) and new format (hotels)
      if (travelPlan.hotel && !travelPlan.hotels) {
        travelPlan.hotels = [travelPlan.hotel];
        travelPlan.selectedHotelIndex = 0;
      }
      
      // Ensure hotels is an array
      if (!travelPlan.hotels || !Array.isArray(travelPlan.hotels)) {
        throw new Error("Hotels must be an array");
      }
      
      // Set default currency if not provided
      if (!travelPlan.currency) {
        travelPlan.currency = "USD";
      }
      
      // Ensure restaurants is an array (if provided)
      if (!travelPlan.restaurants) {
        travelPlan.restaurants = [];
      } else if (!Array.isArray(travelPlan.restaurants)) {
        travelPlan.restaurants = [];
      }
      
    } catch (parseError: any) {
      const content = aiResponse.content || "";
      console.error("Failed to parse AI response:", content);
      console.error("Parse error:", parseError);
      throw new Error(
        `AI returned invalid JSON: ${parseError.message}. ` +
        `Response preview: ${content.substring(0, 300)}`
      );
    }

    // Validate and structure the response
    const response: TravelPlanResponse = {
      success: true,
      data: travelPlan,
    };

    res.json(response);
  } catch (error: any) {
    console.error("Travel plan endpoint error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate travel plan",
    });
  }
});

export default router;

