import sha256 from "crypto-js/sha256";
import axios from "axios";
import getBaseURL from "@/lib/base-url";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { db } from "@/server";
import { orders } from "@/server/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request, res: Response) {
  const data = await req.formData();

  const merchantId = data.get("merchantId");
  const transactionId = data.get("transactionId");

  const dataSha256 = sha256(
    `/pg/v1/status/${merchantId}/${transactionId}` +
      process.env.NEXT_PUBLIC_PHONEPE_SALT_KEY
  );

  const checksum =
    dataSha256 + "###" + process.env.NEXT_PUBLIC_PHONEPE_SALT_INDEX;

  const options = {
    method: "GET",
    url:
      process.env.NEXT_PUBLIC_STATUS_UPI_URL! +
      `/${merchantId}/${transactionId}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": `${merchantId}`,
    },
  };

  const response = await axios.request(options);

  const domain = getBaseURL();

  if (response.data.code === "PAYMENT_SUCCESS") {
    await db
      .update(orders)
      .set({ status: "confirmed" })
      .where(eq(orders.transactionId, String(transactionId)));

    revalidatePath("/dashboard/orders");

    return NextResponse.redirect(
      `${domain}/dashboard/orders?payment_status=success`,
      {
        status: 301,
      }
    );
  } else {
    await db
      .delete(orders)
      .where(eq(orders.transactionId, String(transactionId)));
    return NextResponse.redirect(
      `${domain}/dashboard/orders/payment_status=failure`,
      {
        status: 301,
      }
    );
  }
}
