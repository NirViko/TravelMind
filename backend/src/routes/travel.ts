import { Router, Request, Response } from "express";
import { HuggingFaceService } from "../services/huggingface";
import { GroqService } from "../services/groq";
import { GooglePlacesService } from "../services/googlePlaces";
import { UnsplashService } from "../services/unsplash";
import { TravelPlanRequest, TravelPlanResponse } from "../types/travel";

const router = Router();

// Generate travel plan endpoint
router.post("/plan", async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, destination, budget }: TravelPlanRequest =
      req.body;

    // Validation
    if (!startDate || !endDate || !destination) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: startDate, endDate, destination",
      });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        error: "End date must be after start date",
      });
    }

    // Budget is optional, but if provided, must be positive
    if (budget !== undefined && budget !== null && budget <= 0) {
      return res.status(400).json({
        success: false,
        error: "Budget must be greater than 0 if provided",
      });
    }

    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Create prompt for AI
    const budgetText =
      budget !== undefined && budget !== null
        ? `with a budget of $${budget} USD`
        : "without a specific budget constraint (focus on quality experiences and provide realistic price estimates)";
    const prompt = `You are a travel planning expert. Create a detailed travel itinerary for ${destination} from ${startDate} to ${endDate} (${totalDays} days) ${budgetText}.

CRITICAL REQUIREMENTS - READ CAREFULLY:
- You MUST use ONLY REAL, EXISTING places that actually exist in ${destination}
- Do NOT invent, make up, or create fictional places
- Do NOT use generic names like "City Center" or "Main Square" unless they are the actual official names
- Research actual tourist attractions, museums, landmarks, parks, and points of interest in ${destination}
- Use the EXACT official names of places as they appear in travel guides, official websites, or Google Maps
- If you are not certain a place exists, do not include it
- IMPORTANT: When in doubt, exclude rather than include. It is better to return fewer results than incorrect ones.

IMPORTANT: Return ONLY valid JSON, no additional text before or after.

Requirements:
1. Create a day-by-day itinerary with 3-5 specific destinations/attractions per day
2. Each destination must include:
   - Title (REAL, EXACT name of an ACTUAL tourist attraction/landmark that EXISTS in ${destination}. Examples: "Eiffel Tower" (Paris), "Colosseum" (Rome), "Statue of Liberty" (New York). Do NOT use made-up names)
   - Description (detailed description of what to see/do there, 2-3 sentences - describe what actually exists at this real location)
   - Coordinates (REAL and ACCURATE latitude and longitude as numbers - you MUST use the actual coordinates of the REAL place. Look up the exact coordinates from Google Maps or official sources. Do NOT approximate or invent coordinates. Latitude must be between -90 and 90, longitude between -180 and 180)
   - Visit order (sequential number starting from 1)
   - Estimated duration (e.g., "2 hours", "Half day", "Full day")
   - Image URL (will be automatically fetched from Google Places API - set to null in your response)
   - Price (entry/admission price in local currency if applicable, null if free - use realistic prices for the actual place)
   - Ticket link (URL to buy tickets if applicable, null if not needed)
3. Include 2-3 hotel recommendations (as an array) with:
   - Hotel name (CRITICAL: Use ONLY hotel names that you can VERIFY actually exist in ${destination}. You MUST check that the hotel exists on booking.com, expedia.com, or similar booking sites before including it. 
     * WRONG EXAMPLES (DO NOT DO THIS): "Dan Panorama Ashdod" (doesn't exist), "Hilton Tel Aviv" when searching for "Ashdod", "Marriott [City]" without verification
     * CORRECT APPROACH: Only include hotels you can verify exist. Search booking sites first. If unsure, exclude the hotel entirely.
     * Do NOT combine hotel chain names with city names. Do NOT assume a chain hotel exists in a city just because the chain exists elsewhere.
     * If you cannot verify a hotel exists through actual booking sites, do NOT include it. Return fewer hotels rather than fictional ones)
   - Description (2-3 sentences about the hotel - describe what actually exists at this verified hotel)
   - Coordinates (REAL and ACCURATE latitude and longitude of the actual hotel location - only if you verified the hotel exists)
   - Booking links (CRITICAL: Use REAL, FUNCTIONAL booking URLs from sites like "https://www.booking.com/hotel/...", "https://www.expedia.com/...", "https://www.agoda.com/...", "https://www.hotels.com/..." for the specific hotel. These links MUST lead directly to the booking page where users can actually purchase a stay. If you cannot find a real, functional link for a verified hotel, use "N/A". Do NOT generate fake or generic booking links. If you cannot verify the hotel exists, do NOT include it at all)
   - Estimated price per night in local currency (realistic for the destination${
     budget !== undefined && budget !== null ? ` and budget of $${budget}` : ""
   } - only for verified hotels)
4. Determine the local currency based on the destination (e.g., EUR for Europe, GBP for UK, JPY for Japan, USD for US, etc.)
5. ${
      budget !== undefined && budget !== null
        ? `Calculate estimated total cost for the trip in local currency (should be close to but under the budget of $${budget})`
        : "Provide estimated total cost for the trip in local currency based on realistic prices for activities, hotels, and restaurants"
    }
6. Include 5-8 restaurant recommendations in the area with:
   - Restaurant name (REAL restaurant names that ACTUALLY EXIST in ${destination}. Use actual restaurant names from Google Maps, TripAdvisor, or similar. Do NOT invent restaurant names)
   - Description (2-3 sentences about the cuisine and atmosphere - describe what actually exists)
   - Cuisine type (e.g., "Italian", "French", "Asian Fusion")
   - Price range (e.g., "$", "$$", "$$$", "$$$$")
   - Coordinates (REAL and ACCURATE latitude and longitude - use the exact coordinates of the actual restaurant location from Google Maps)
   - Rating (1-5 stars - use realistic ratings)
   - Website URL (if available, or null)
   - Image URL (if available, or null)
7. Include 3-5 travel recommendations/tips as an array

Return the response as a valid JSON object with this EXACT structure (no markdown, no code blocks):
{
  "destination": "${destination}",
  "startDate": "${startDate}",
  "endDate": "${endDate}",
  "totalDays": ${totalDays},
  ${budget !== undefined && budget !== null ? `"budget": ${budget},` : ""}
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

CRITICAL VALIDATION RULES - FOLLOW THESE EXACTLY:
1. ALL PLACES MUST BE REAL AND EXISTING:
   - Destinations: Use ONLY actual tourist attractions, museums, landmarks, parks that REALLY EXIST in ${destination}
   - Hotels: EXTREMELY CRITICAL - Use ONLY hotel names that you can VERIFY exist in ${destination}. Before including any hotel:
     * You MUST check if it exists on booking.com, expedia.com, agoda.com, or hotels.com
     * WRONG: "Dan Panorama Ashdod" (doesn't exist - you're guessing based on chain name)
     * WRONG: "Hilton [City]" without verification
     * WRONG: Combining any chain name with city name without checking
     * CORRECT: Only include hotels you found on actual booking sites
     * If you cannot verify a hotel exists through actual booking sites, DO NOT include it
     * It is better to return 0 hotels than to include 1 fictional hotel
     * When in doubt, EXCLUDE the hotel
   - Restaurants: Use ONLY real restaurant names that ACTUALLY EXIST in ${destination}. Verify on Google Maps or TripAdvisor before including.
   - Do NOT create fictional places, generic names, or approximate locations
   - If you are unsure if a place exists, do not include it
   - REMEMBER: Accuracy is more important than quantity. Fewer accurate results is better than many incorrect results.

2. ALL COORDINATES MUST BE REAL AND ACCURATE:
   - Use actual coordinates from Google Maps, official websites, or verified sources
   - For destinations: Exact coordinates of the real tourist attraction/landmark
   - For restaurants: Exact coordinates of the actual restaurant location
   - For hotels: Exact coordinates of the actual hotel location
   - Do NOT invent, approximate, or guess coordinates - this causes navigation errors
   - Verify: latitude between -90 and 90, longitude between -180 and 180

3. VERIFICATION:
   - Before including any place, verify it actually exists in ${destination}
   - Use official names as they appear in travel guides or Google Maps
   - Prefer well-known, established places over obscure or potentially fictional ones

4. BOOKING LINKS:
   - For hotels, provide REAL, FUNCTIONAL booking URLs.
   - Ensure the links lead directly to the booking page for the specific hotel.
   - If a real, functional link cannot be found, use "N/A" for that specific link.
   - Do NOT generate fake or generic booking links.

Return ONLY valid JSON, no additional text.`;

    // Call AI to generate travel plan using chat completion
    // Convert prompt to chat messages format
    const messages = [
      {
        role: "system" as const,
        content:
          "You are a FACTUAL travel planning expert. Your ONLY job is to provide 100% ACCURATE, VERIFIED information. You MUST NEVER invent, guess, or create fictional places, hotels, or restaurants. CRITICAL RULES: 1) For hotels: You MUST verify each hotel exists on booking.com, expedia.com, agoda.com, or hotels.com BEFORE including it. Do NOT combine chain names with cities (e.g., 'Dan Panorama Ashdod' is WRONG if it doesn't exist - verify first!). If you cannot verify a hotel exists, DO NOT include it. 2) For places: Use ONLY real tourist attractions that you can verify exist. Use exact names from Google Maps or official sources. 3) For coordinates: Use ONLY real coordinates from Google Maps - never invent them. 4) When in doubt: EXCLUDE. It is better to return fewer results than incorrect ones. Your accuracy is critical - users rely on this information to make real travel decisions.",
      },
      {
        role: "user" as const,
        content: prompt,
      },
    ];

    // Using AI for travel plan generation
    // Try Groq first (free, fast, accurate), fallback to Hugging Face if not available
    let aiResponse;

    // Check if Groq API key is configured
    if (process.env.GROQ_API_KEY) {
      try {
        // Groq offers free tier with very accurate models
        // llama-3.1-70b-versatile is much more accurate than Llama 3 8B
        aiResponse = await GroqService.chatCompletion(
          messages,
          "llama-3.1-70b-versatile", // 70B model - much more accurate than 8B
          {
            maxTokens: 4000,
            temperature: 0.1, // Very low temperature for maximum accuracy and minimal creativity
          },
        );
      } catch (groqError: any) {
        console.warn(
          "Groq API not available, falling back to Hugging Face:",
          groqError.message,
        );
      }
    }

    // Use Hugging Face if Groq failed or is not configured
    if (!aiResponse) {
      aiResponse = await HuggingFaceService.chatCompletion(
        messages,
        "meta-llama/Meta-Llama-3-8B-Instruct",
        {
          max_tokens: 4000,
          temperature: 0.1, // Very low temperature for maximum accuracy
        },
      );
    }

    // Ensure we have a response
    if (!aiResponse) {
      throw new Error("Failed to get response from AI service");
    }

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
        // Fix incomplete numbers in coordinates (e.g., "34.764" -> "34.764000")
        jsonString = jsonString.replace(
          /"longitude":\s*(\d+\.\d{1,5})(?=\s*[,\]}])/g,
          (match: string, num: string) => {
            const parts = num.split(".");
            if (parts[1] && parts[1].length < 6) {
              const padded = num + "0".repeat(6 - parts[1].length);
              return `"longitude": ${padded}`;
            }
            return match;
          },
        );

        jsonString = jsonString.replace(
          /"latitude":\s*(\d+\.\d{1,5})(?=\s*[,\]}])/g,
          (match: string, num: string) => {
            const parts = num.split(".");
            if (parts[1] && parts[1].length < 6) {
              const padded = num + "0".repeat(6 - parts[1].length);
              return `"latitude": ${padded}`;
            }
            return match;
          },
        );

        // Try to close incomplete arrays/objects
        const openBraces = (jsonString.match(/\{/g) || []).length;
        const closeBraces = (jsonString.match(/\}/g) || []).length;
        const openBrackets = (jsonString.match(/\[/g) || []).length;
        const closeBrackets = (jsonString.match(/\]/g) || []).length;

        // Add missing closing brackets
        if (openBrackets > closeBrackets) {
          jsonString += "]".repeat(openBrackets - closeBrackets);
        }
        if (openBraces > closeBraces) {
          jsonString += "}".repeat(openBraces - closeBraces);
        }

        // Try parsing again
        try {
          travelPlan = JSON.parse(jsonString);
        } catch (secondError: any) {
          // Last resort: try to extract what we can by finding the last complete restaurant object
          console.error(
            "JSON parsing failed after fixes:",
            secondError.message,
          );

          // Try to extract up to the last complete restaurant
          const restaurantsMatch = jsonString.match(
            /"restaurants":\s*\[([\s\S]*?)\]/,
          );
          if (restaurantsMatch) {
            // Remove incomplete restaurants array and try again
            const beforeRestaurants = jsonString.substring(
              0,
              jsonString.indexOf('"restaurants"'),
            );
            const fixedJson = beforeRestaurants + '"restaurants": []}';
            try {
              travelPlan = JSON.parse(fixedJson);
              travelPlan.restaurants = []; // Set empty array if we had to remove it
            } catch {
              throw new Error(
                `Failed to parse AI response. The response may be incomplete. ` +
                  `Error: ${secondError.message}. ` +
                  `Response preview: ${jsonString.substring(
                    Math.max(0, jsonString.length - 500),
                  )}`,
              );
            }
          } else {
            throw new Error(
              `Failed to parse AI response. The response may be incomplete. ` +
                `Error: ${secondError.message}. ` +
                `Response preview: ${jsonString.substring(
                  Math.max(0, jsonString.length - 500),
                )}`,
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

      // Enhance with real photos from Google Places API
      if (process.env.GOOGLE_PLACES_API_KEY) {
        try {
          // Get photos for destinations
          if (travelPlan.itinerary && Array.isArray(travelPlan.itinerary)) {
            const destinationPhotos =
              await GooglePlacesService.getRealPlacePhotos(
                travelPlan.itinerary.map((dest: any) => ({
                  name: dest.title,
                  coordinates: dest.coordinates,
                })),
              );

            let photosFound = 0;
            travelPlan.itinerary = travelPlan.itinerary.map((dest: any) => {
              const photoUrl = destinationPhotos.get(dest.title);
              if (photoUrl) {
                dest.imageUrl = photoUrl;
                photosFound++;
              }
              return dest;
            });
          }

          // Get photos for hotels
          if (travelPlan.hotels && Array.isArray(travelPlan.hotels)) {
            const hotelPhotos = await GooglePlacesService.getRealPlacePhotos(
              travelPlan.hotels.map((hotel: any) => ({
                name: hotel.name,
                coordinates: hotel.coordinates,
              })),
            );

            let photosFound = 0;
            travelPlan.hotels = travelPlan.hotels.map((hotel: any) => {
              const photoUrl = hotelPhotos.get(hotel.name);
              if (photoUrl) {
                hotel.imageUrl = photoUrl;
                photosFound++;
              }
              return hotel;
            });
          }

          // Get photos for restaurants
          if (travelPlan.restaurants && Array.isArray(travelPlan.restaurants)) {
            const restaurantPhotos =
              await GooglePlacesService.getRealPlacePhotos(
                travelPlan.restaurants.map((rest: any) => ({
                  name: rest.name,
                  coordinates: rest.coordinates,
                })),
              );

            let photosFound = 0;
            travelPlan.restaurants = travelPlan.restaurants.map((rest: any) => {
              const photoUrl = restaurantPhotos.get(rest.name);
              if (photoUrl) {
                rest.imageUrl = photoUrl;
                photosFound++;
              }
              return rest;
            });
          }
        } catch (photoError: any) {
          console.warn(
            "⚠️  Error fetching photos from Google Places API, trying Unsplash:",
            photoError.message,
          );
          // Fallback to Unsplash
          await addUnsplashPhotos(travelPlan, destination);
        }
      } else {
        await addUnsplashPhotos(travelPlan, destination);
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

      // Validate coordinates for all destinations
      if (travelPlan.itinerary && Array.isArray(travelPlan.itinerary)) {
        travelPlan.itinerary = travelPlan.itinerary.filter((dest: any) => {
          if (
            !dest.coordinates ||
            typeof dest.coordinates.latitude !== "number" ||
            typeof dest.coordinates.longitude !== "number"
          ) {
            console.warn(`Invalid coordinates for destination: ${dest.title}`);
            return false;
          }
          const lat = dest.coordinates.latitude;
          const lng = dest.coordinates.longitude;
          if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            console.warn(
              `Out of range coordinates for destination: ${dest.title} (${lat}, ${lng})`,
            );
            return false;
          }
          return true;
        });
      }

      // Validate coordinates for restaurants
      if (travelPlan.restaurants && Array.isArray(travelPlan.restaurants)) {
        travelPlan.restaurants = travelPlan.restaurants.filter((rest: any) => {
          if (
            !rest.coordinates ||
            typeof rest.coordinates.latitude !== "number" ||
            typeof rest.coordinates.longitude !== "number"
          ) {
            console.warn(`Invalid coordinates for restaurant: ${rest.name}`);
            return false;
          }
          const lat = rest.coordinates.latitude;
          const lng = rest.coordinates.longitude;
          if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            console.warn(
              `Out of range coordinates for restaurant: ${rest.name} (${lat}, ${lng})`,
            );
            return false;
          }
          return true;
        });
      }

      // Validate coordinates for hotels and check for suspicious patterns
      if (travelPlan.hotels && Array.isArray(travelPlan.hotels)) {
        travelPlan.hotels = travelPlan.hotels.filter((hotel: any) => {
          const hotelName = (hotel.name || "").toLowerCase();
          const destinationLower = destination.toLowerCase();

          // Check if all booking links are "N/A" - this is suspicious
          const allLinksNA =
            !hotel.bookingLinks ||
            ((hotel.bookingLinks.booking === "N/A" ||
              !hotel.bookingLinks.booking) &&
              (hotel.bookingLinks.expedia === "N/A" ||
                !hotel.bookingLinks.expedia) &&
              (hotel.bookingLinks.agoda === "N/A" ||
                !hotel.bookingLinks.agoda) &&
              (hotel.bookingLinks.hotels === "N/A" ||
                !hotel.bookingLinks.hotels));

          // If all booking links are N/A, filter out the hotel (likely fictional)
          if (allLinksNA) {
            console.warn(
              `Filtering out hotel "${hotel.name}" - no booking links available (likely unverified/fictional)`,
            );
            return false;
          }

          // Check for suspicious patterns: chain name + city name combinations
          const commonChains = [
            "dan panorama",
            "dan hotel",
            "hilton",
            "marriott",
            "sheraton",
            "hyatt",
            "radisson",
            "intercontinental",
            "holiday inn",
            "ramada",
          ];

          const hasChainName = commonChains.some((chain) =>
            hotelName.includes(chain),
          );
          const hasCityName = hotelName.includes(destinationLower);

          // If hotel has both chain name and city name but no booking links, it's suspicious
          if (hasChainName && hasCityName && allLinksNA) {
            console.warn(
              `Filtering out suspicious hotel "${hotel.name}" - appears to be fictional (chain + city name but no booking links)`,
            );
            return false;
          }

          // Validate coordinates if present
          if (hotel.coordinates) {
            if (
              typeof hotel.coordinates.latitude !== "number" ||
              typeof hotel.coordinates.longitude !== "number"
            ) {
              console.warn(`Invalid coordinates for hotel: ${hotel.name}`);
              return false;
            }
            const lat = hotel.coordinates.latitude;
            const lng = hotel.coordinates.longitude;
            if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
              console.warn(
                `Out of range coordinates for hotel: ${hotel.name} (${lat}, ${lng})`,
              );
              return false;
            }
          }
          return true;
        });
      }
    } catch (parseError: any) {
      const content = aiResponse.content || "";
      console.error("Failed to parse AI response:", content);
      console.error("Parse error:", parseError);
      throw new Error(
        `AI returned invalid JSON: ${parseError.message}. ` +
          `Response preview: ${content.substring(0, 300)}`,
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

/**
 * Add photos from Unsplash API (fallback when Google Places doesn't work)
 */
async function addUnsplashPhotos(travelPlan: any, destination: string) {
  try {
    // Get photos for destinations
    if (travelPlan.itinerary && Array.isArray(travelPlan.itinerary)) {
      const destinationPhotos = await UnsplashService.getPhotosForPlaces(
        travelPlan.itinerary.map((dest: any) => ({
          name: dest.title,
          location: destination,
          type: "destination" as const,
        })),
      );

      travelPlan.itinerary = travelPlan.itinerary.map((dest: any) => {
        const photoUrl = destinationPhotos.get(dest.title);
        if (photoUrl && !dest.imageUrl) {
          dest.imageUrl = photoUrl;
        }
        return dest;
      });
    }

    // Get photos for hotels
    if (travelPlan.hotels && Array.isArray(travelPlan.hotels)) {
      const hotelPhotos = await UnsplashService.getPhotosForPlaces(
        travelPlan.hotels.map((hotel: any) => ({
          name: hotel.name,
          location: destination,
          type: "hotel" as const,
        })),
      );

      travelPlan.hotels = travelPlan.hotels.map((hotel: any) => {
        const photoUrl = hotelPhotos.get(hotel.name);
        if (photoUrl && !hotel.imageUrl) {
          hotel.imageUrl = photoUrl;
        }
        return hotel;
      });
    }

    // Get photos for restaurants
    if (travelPlan.restaurants && Array.isArray(travelPlan.restaurants)) {
      const restaurantPhotos = await UnsplashService.getPhotosForPlaces(
        travelPlan.restaurants.map((rest: any) => ({
          name: rest.name,
          location: destination,
          type: "restaurant" as const,
        })),
      );

      travelPlan.restaurants = travelPlan.restaurants.map((rest: any) => {
        const photoUrl = restaurantPhotos.get(rest.name);
        if (photoUrl && !rest.imageUrl) {
          rest.imageUrl = photoUrl;
        }
        return rest;
      });
    }
  } catch (error: any) {
    console.warn("⚠️  Error adding Unsplash photos:", error.message);
  }
}

export default router;
