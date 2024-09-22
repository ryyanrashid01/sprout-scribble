export default function formatPrice(price: number) {
  let formattedPrice = new Intl.NumberFormat("en-US", {
    currency: "INR",
    style: "currency",
  }).format(price);

  formattedPrice = formattedPrice.replace("₹", "₹ ");

  return formattedPrice;
}
