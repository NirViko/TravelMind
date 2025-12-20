// Currency detection based on destination
export const getCurrencyForDestination = (destination: string): string => {
  const dest = destination.toLowerCase();
  
  // Europe
  if (dest.includes("france") || dest.includes("paris") || 
      dest.includes("germany") || dest.includes("berlin") ||
      dest.includes("italy") || dest.includes("rome") ||
      dest.includes("spain") || dest.includes("madrid") ||
      dest.includes("portugal") || dest.includes("lisbon") ||
      dest.includes("netherlands") || dest.includes("amsterdam") ||
      dest.includes("belgium") || dest.includes("brussels") ||
      dest.includes("austria") || dest.includes("vienna") ||
      dest.includes("greece") || dest.includes("athens") ||
      dest.includes("finland") || dest.includes("helsinki") ||
      dest.includes("ireland") || dest.includes("dublin")) {
    return "EUR";
  }
  
  // UK
  if (dest.includes("united kingdom") || dest.includes("uk") ||
      dest.includes("england") || dest.includes("london") ||
      dest.includes("scotland") || dest.includes("edinburgh") ||
      dest.includes("wales")) {
    return "GBP";
  }
  
  // Japan
  if (dest.includes("japan") || dest.includes("tokyo") ||
      dest.includes("osaka") || dest.includes("kyoto")) {
    return "JPY";
  }
  
  // China
  if (dest.includes("china") || dest.includes("beijing") ||
      dest.includes("shanghai")) {
    return "CNY";
  }
  
  // India
  if (dest.includes("india") || dest.includes("mumbai") ||
      dest.includes("delhi")) {
    return "INR";
  }
  
  // Australia
  if (dest.includes("australia") || dest.includes("sydney") ||
      dest.includes("melbourne")) {
    return "AUD";
  }
  
  // Canada
  if (dest.includes("canada") || dest.includes("toronto") ||
      dest.includes("vancouver")) {
    return "CAD";
  }
  
  // Switzerland
  if (dest.includes("switzerland") || dest.includes("zurich") ||
      dest.includes("geneva")) {
    return "CHF";
  }
  
  // Default to USD
  return "USD";
};

export const formatCurrency = (amount: number, currency: string = "USD"): string => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
};

