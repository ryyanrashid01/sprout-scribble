import { VariantsWithImagesTags } from "@/lib/infer-types";

type ProductColumn = {
  id: number;
  title: string;
  price: number;
  image: string;
  variants: VariantsWithImagesTags[];
};

export default ProductColumn;
