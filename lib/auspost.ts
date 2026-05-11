const AUSPOST_API_KEY = process.env.AUSPOST_API_KEY || "";
const AUSPOST_BASE_URL = "https://digitalapi.auspost.com.au";

interface ParcelDimensions {
  length: number; // in cm
  width: number; // in cm
  height: number; // in cm
  weight: number; // in kg
}

interface AuspostQuoteParams extends ParcelDimensions {
  fromPostcode: string;
  toPostcode: string;
  serviceCode?: string;
}

interface AuspostQuoteResponse {
  postage_result: {
    service: string;
    delivery_time: string;
    total_cost: string;
    costs: unknown;
  };
}

/**
 * Calculate delivery price using Australia Post API
 * @param params - Parcel and delivery details
 * @returns Delivery price in AUD, or null if API fails
 */
export async function calculateAuspostDeliveryPrice(
  params: AuspostQuoteParams,
): Promise<number | null> {
  try {
    if (!AUSPOST_API_KEY) {
      console.error("AUSPOST_API_KEY is not set in environment variables");
      return null;
    }

    const queryParams = new URLSearchParams({
      from_postcode: params.fromPostcode,
      to_postcode: params.toPostcode,
      length: params.length.toString(),
      width: params.width.toString(),
      height: params.height.toString(),
      weight: params.weight.toString(),
      service_code: params.serviceCode || "AUS_PARCEL_REGULAR",
    });

    const url = `${AUSPOST_BASE_URL}/postage/parcel/domestic/calculate.json?${queryParams}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "AUTH-KEY": AUSPOST_API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `Australia Post API error: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    const data: AuspostQuoteResponse = await response.json();

    // Get the price from the first product in the response
    if (data.postage_result && Number(data.postage_result.total_cost) > 0) {
      const price = parseFloat(data.postage_result.total_cost);
      return isNaN(price) ? null : price;
    }

    return null;
  } catch (error) {
    console.error("Error calculating Australia Post delivery price:", error);
    return null;
  }
}

// /**
//  * Get all available shipping services and their prices
//  * @param params - Parcel and delivery details
//  * @returns Array of available services with prices
//  */
// export async function getAuspostServices(
//   params: Omit<AuspostQuoteParams, "serviceCode">,
// ): Promise<Array<{ id: string; name: string; price: number }> | null> {
//   try {
//     if (!AUSPOST_API_KEY) {
//       console.error("AUSPOST_API_KEY is not set in environment variables");
//       return null;
//     }

//     const queryParams = new URLSearchParams({
//       from_postcode: params.fromPostcode,
//       to_postcode: params.toPostcode,
//       length: params.length.toString(),
//       width: params.width.toString(),
//       height: params.height.toString(),
//       weight: params.weight.toString(),
//     });

//     const url = `${AUSPOST_BASE_URL}/postage/parcel/domestic/calculate.json?${queryParams}`;

//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         "AUTH-KEY": AUSPOST_API_KEY,
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       console.error(
//         `Australia Post API error: ${response.status} ${response.statusText}`,
//       );
//       return null;
//     }

//     const data: AuspostQuoteResponse = await response.json();

//     if (data.postage_result && Number(data.postage_result.total_cost) > 0) {
//       return data.postage_result.map((product) => ({
//         id: product.product_id,
//         name: product.product_name,
//         price: parseFloat(product.price),
//       }));
//     }

//     return null;
//   } catch (error) {
//     console.error("Error getting Australia Post services:", error);
//     return null;
//   }
// }
