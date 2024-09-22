import { db } from "@/server";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import placeholder from "@/public/product-placeholder.png";
import { DataTable } from "@/components/dashboard/data-table";
import { columns } from "@/components/dashboard/columns";

export default async function Products() {
  const session = await auth();
  if (session?.user.role !== "admin") {
    redirect("/dashboard");
  }

  const products = await db.query.products.findMany({
    with: {
      productVariants: {
        with: { variantImages: true, variantTags: true },
      },
    },
    orderBy: (products, { desc }) => [desc(products.id)],
  });

  const dataTable = products.map((product) => {
    if (product.productVariants.length === 0) {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        image: placeholder.src,
        variants: [],
      };
    }
    const image = product.productVariants[0].variantImages[0].url;
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      variants: product.productVariants,
      image,
    };
  });

  if (!dataTable) return { error: "Products data not found" };

  return (
    <div>
      <DataTable columns={columns} data={dataTable} />
    </div>
  );
}
