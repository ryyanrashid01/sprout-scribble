"use client";

import formatPrice from "@/lib/format-price";
import { UserOrdersWithShipping } from "@/lib/infer-types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function Receipt({ order }: { order: UserOrdersWithShipping }) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    window.print();
  };

  return (
    <>
      <style>
        {`\
        @media print {
          nav {
            display: none;
          }
          #downloadReceipt {
            display: none;
          }
          .dark {
            --background: 0 0% 100%;
            --foreground: 20 14.3% 4.1%;
            --card: 0 0% 100%;
            --card-foreground: 20 14.3% 4.1%;
            --popover: 0 0% 100%;
            --popover-foreground: 20 14.3% 4.1%;
            --primary: 24.6 95% 53.1%;
            --primary-foreground: 60 9.1% 97.8%;
            --secondary: 60 4.8% 95.9%;
            --secondary-foreground: 24 9.8% 10%;
            --muted: 60 4.8% 95.9%;
            --muted-foreground: 25 5.3% 44.7%;
            --accent: 60 4.8% 95.9%;
            --accent-foreground: 24 9.8% 10%;
            --destructive: 0 84.2% 60.2%;
            --destructive-foreground: 60 9.1% 97.8%;
            --border: 20 5.9% 90%;
            --input: 20 5.9% 90%;
            --ring: 24.6 95% 53.1%;
            --radius: 0.5rem;
            --chart-1: 12 76% 61%;
            --chart-2: 173 58% 39%;
            --chart-3: 197 37% 24%;
            --chart-4: 43 74% 66%;
            --chart-5: 27 87% 67%;
          }
        } 
      `}
      </style>
      <div className="flex items-center justify-center mb-3">
        <Button variant={"ghost"} onClick={handleDownload} id="downloadReceipt">
          <Download className="mr-3" size={13} /> Download Receipt
        </Button>
      </div>
      <Card className="max-w-4xl mx-auto" ref={invoiceRef} id="receipt">
        <CardHeader>
          <CardTitle>
            Invoice for Order #{order.id}{" "}
            <p className="text-sm text-secondary-foreground font-normal mt-2">
              {order.created?.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
              {" / "}
              <span className="text-gray-500 dark:text-gray-400">
                {order.transactionId}
              </span>
            </p>
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="flex justify-between items-center mt-4">
            <div>
              <p>{order.shippingAddress.name}</p>
              <div className="text-xs mt-2">
                {order.shippingAddress.email ? (
                  <p>{order.shippingAddress.email}</p>
                ) : null}
                <p>{order.shippingAddress.address1}</p>
                {order.shippingAddress.address2 ? (
                  <p>
                    {order.shippingAddress.address2},{" "}
                    {order.shippingAddress.pincode}
                  </p>
                ) : (
                  <p>{order.shippingAddress.pincode}</p>
                )}
                <p>Phone: +91 {order.shippingAddress.phone}</p>
              </div>
            </div>
            <div>
              <svg
                width="189"
                height="10"
                viewBox="0 0 189 10"
                className="fill-secondary-foreground hover:fill-secondary-foreground/75 transition-all duration-500 ease-in-out cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_158_7)">
                  <path d="M0.062103 6.58659H2.67043C2.67043 7.40741 3.28111 8.06807 5.77558 8.06807C8.41495 8.06807 8.84967 7.55756 8.84967 6.8969C8.84967 6.4965 8.59091 6.26627 8.06303 6.14615C7.442 6.01602 5.91013 5.95596 4.80263 5.8959C3.48812 5.82583 2.0287 5.66567 1.21101 5.25526C0.486473 4.88488 0 4.2042 0 3.26326C0 1.46146 1.79064 0 5.74452 0C10.485 0 11.3131 1.58158 11.3131 3.33333H8.70476C8.70476 2.45245 7.81462 1.94194 5.74452 1.94194C3.67443 1.94194 2.90849 2.36236 2.90849 3.05305C2.90849 3.42342 3.12585 3.64364 3.55022 3.77377C4.0988 3.93393 5.59962 3.99399 6.71747 4.06406C8.17689 4.15415 9.41895 4.27427 10.2677 4.6046C11.2199 4.98498 11.7685 5.74575 11.7685 6.67668C11.7685 8.1982 10.9198 10.01 5.77558 10.01C0.63138 10.01 0.062103 7.87788 0.062103 6.58659Z"></path>
                  <path d="M13.2279 0.180176H19.2312C22.6469 0.180176 24.1477 1.34134 24.1477 3.64364C24.1477 5.94594 22.6779 6.98698 19.1587 6.98698H16.1364V9.82983H13.2279V0.180176ZM19.0966 5.19519C20.6596 5.19519 21.3841 4.72472 21.3841 3.73373C21.3841 2.74274 20.732 2.27227 19.107 2.27227H16.1364V5.2052H19.0966V5.19519Z"></path>
                  <path d="M25.3794 0.180176H31.6518C35.3469 0.180176 36.5062 1.31131 36.5062 3.04304C36.5062 4.01401 36.0818 4.94494 34.7052 5.34534V5.37537C36.2785 5.72572 36.4441 6.79679 36.4441 7.8078V9.82983H33.5356V7.8078C33.5356 6.8068 33.1423 6.35635 31.9002 6.35635H28.2879V9.82983H25.3794V0.180176ZM31.7967 4.71471C33.2354 4.71471 33.7529 4.2042 33.7529 3.45345C33.7529 2.76276 33.2251 2.26226 31.5379 2.26226H28.2982V4.71471H31.7967Z"></path>
                  <path d="M37.8724 4.95495C37.8724 2.28228 39.9218 0 44.4243 0C48.9268 0 50.9762 2.29229 50.9762 4.95495C50.9762 7.61762 49.082 10 44.4243 10C39.7666 10 37.8724 7.84785 37.8724 4.95495ZM47.9124 4.96497C47.9124 3.39339 46.7946 2.07207 44.4243 2.07207C42.054 2.07207 40.9362 3.39339 40.9362 4.96497C40.9362 6.6967 42.0437 7.90791 44.4243 7.90791C46.8049 7.90791 47.9124 6.61662 47.9124 4.96497Z"></path>
                  <path d="M52.2493 5.51551V0.180176H55.1578V5.2052C55.1578 7.05705 56.3377 7.76776 58.2836 7.76776C60.2295 7.76776 61.4095 7.04704 61.4095 5.2052V0.180176H64.0178V5.51551C64.0178 8.56856 61.8028 10 58.149 10C54.4953 10 52.2493 8.55855 52.2493 5.51551Z"></path>
                  <path d="M69.0792 2.26226H65.1564V0.180176H75.9209V2.26226H71.998V9.82983H69.0896V2.26226H69.0792Z"></path>
                  <path d="M94.7381 7.94795V9.95996C94.5828 9.98999 94.3448 10 94.1274 10C92.8129 10 91.457 9.67968 90.1839 9.07908C89.035 9.67968 87.7308 10 86.2921 10C83.0731 10 81.5205 8.31832 81.5205 6.61662C81.5205 5.34535 82.4728 3.94394 84.8741 3.84384C84.7085 3.42342 84.636 3.03303 84.636 2.68268C84.636 1.3013 85.7435 0 88.2794 0C90.8152 0 91.8917 1.23123 91.8917 2.64264C91.8917 4.13413 90.5565 5.06507 88.5381 5.0951H88.5278C89.0246 5.66567 89.6974 6.20621 90.4116 6.66667C91.0947 6.04605 91.6847 5.28529 92.078 4.39439H94.469C93.9204 5.64565 93.1959 6.72673 92.3057 7.58759C93.0613 7.83784 93.8065 7.95796 94.4483 7.95796H94.7691L94.7381 7.94795ZM86.5198 8.12813C87.1098 8.12813 87.6687 8.05806 88.2069 7.8979C87.1926 7.14715 86.2817 6.23624 85.64 5.27528H85.5986C84.4911 5.36537 84.222 6.05606 84.222 6.53654C84.222 7.34735 85.0397 8.13814 86.5301 8.13814L86.5198 8.12813ZM87.3271 2.88288C87.3271 3.19319 87.4306 3.48348 87.5962 3.8038C89.0971 3.79379 89.48 3.43343 89.48 2.73273C89.48 2.32232 89.1281 1.88188 88.4139 1.88188C87.6997 1.88188 87.3271 2.32232 87.3271 2.88288Z"></path>
                  <path d="M100.441 6.58659H103.049C103.049 7.40741 103.66 8.06807 106.155 8.06807C108.794 8.06807 109.229 7.55756 109.229 6.8969C109.229 6.4965 108.97 6.26627 108.442 6.14615C107.821 6.01602 106.289 5.95596 105.182 5.8959C103.867 5.82583 102.408 5.66567 101.59 5.25525C100.865 4.88488 100.379 4.2042 100.379 3.26326C100.379 1.47147 102.17 0.0100098 106.124 0.0100098C110.864 0.0100098 111.692 1.59159 111.692 3.34334H109.084C109.084 2.46246 108.194 1.95195 106.124 1.95195C104.053 1.95195 103.288 2.37237 103.288 3.06306C103.288 3.43343 103.505 3.65365 103.929 3.78378C104.478 3.94394 105.979 4.004 107.096 4.07407C108.556 4.16416 109.798 4.28428 110.647 4.61461C111.599 4.99499 112.148 5.75576 112.148 6.68669C112.148 8.20821 111.299 10.02 106.155 10.02C101.01 10.02 100.441 7.8979 100.441 6.60661V6.58659Z"></path>
                  <path d="M113.276 5.01502C113.276 2.15215 115.387 0 119.538 0C123.937 0 125.355 2.31231 125.355 3.93393C125.355 3.96396 125.355 4.08408 125.344 4.16416H122.757V4.1041C122.757 3.21321 121.836 2.08208 119.683 2.08208C117.53 2.08208 116.35 3.35335 116.35 5.01502C116.35 6.55656 117.292 7.91792 119.703 7.91792C121.763 7.91792 122.809 7.00701 122.809 5.93594V5.84585H125.396C125.407 5.91592 125.407 6.02603 125.407 6.05606C125.407 7.93794 123.833 10 119.569 10C114.839 10 113.276 7.50751 113.276 5.01502Z"></path>
                  <path d="M126.794 0.180176H133.066C136.761 0.180176 137.92 1.31131 137.92 3.04304C137.92 4.01401 137.496 4.94494 136.119 5.34534V5.37537C137.693 5.72572 137.858 6.79679 137.858 7.8078V9.82983H134.95V7.8078C134.95 6.8068 134.556 6.35635 133.314 6.35635H129.702V9.82983H126.794V0.180176ZM133.211 4.71471C134.65 4.71471 135.167 4.2042 135.167 3.45345C135.167 2.76276 134.639 2.26226 132.952 2.26226H129.712V4.71471H133.211Z"></path>
                  <path d="M139.69 0.180176H142.599V9.82983H139.69V0.180176Z"></path>
                  <path d="M144.41 0.180176H150.745C154.429 0.180176 154.988 1.6016 154.988 2.73273C154.988 3.51351 154.605 4.44444 153.27 4.78478C154.957 5.07507 155.485 6.13613 155.485 6.99699C155.485 8.56857 154.636 9.82983 150.962 9.82983H144.4V0.180176H144.41ZM150.827 4.09409C152.038 4.09409 152.463 3.71371 152.463 3.09309C152.463 2.53253 151.997 2.11211 150.641 2.11211H147.319V4.09409H150.817H150.827ZM150.838 7.9079C152.307 7.9079 152.732 7.45745 152.732 6.74674C152.732 6.21621 152.245 5.73573 150.9 5.73573H147.319V7.9079H150.838Z"></path>
                  <path d="M156.882 0.180176H163.217C166.902 0.180176 167.461 1.6016 167.461 2.73273C167.461 3.51351 167.078 4.44444 165.742 4.78478C167.43 5.07507 167.957 6.13613 167.957 6.99699C167.957 8.56857 167.109 9.82983 163.434 9.82983H156.872V0.180176H156.882ZM163.3 4.09409C164.511 4.09409 164.935 3.71371 164.935 3.09309C164.935 2.53253 164.469 2.11211 163.113 2.11211H159.791V4.09409H163.289H163.3ZM163.31 7.9079C164.78 7.9079 165.204 7.45745 165.204 6.74674C165.204 6.21621 164.718 5.73573 163.372 5.73573H159.791V7.9079H163.31Z"></path>
                  <path d="M169.355 0.180176H172.263V7.59759H178.173V9.82983H169.344V0.180176H169.355Z"></path>
                  <path d="M179.415 0.180176H188.845V2.26226H182.324V4.15415H187.323V5.79579H182.324V7.74774H189V9.82983H179.415V0.180176Z"></path>
                </g>
                <defs>
                  <clipPath id="clip0_158_7">
                    <rect width="189" height="10" fill="white"></rect>
                  </clipPath>
                </defs>
              </svg>
              <p className="text-xs mt-3 text-right">Main Market, Awantipora</p>
              <p className="text-xs text-right">Pulwama, Jammu & Kashmir</p>
              <p className="text-xs text-right">192122</p>
            </div>
          </div>
          <Separator className="my-6" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Item</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderProduct.map((item, index) => (
                <TableRow>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {item.product.title + " - " + item.variant.productType}
                  </TableCell>
                  <TableCell>{formatPrice(item.product.price)}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {formatPrice(item.product.price * item.quantity)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold">
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell className="text-center">Total</TableCell>
                <TableCell className="text-right">
                  {formatPrice(order.total)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
        <Separator />
        <CardFooter className="flex items-center justify-center mt-3">
          <p className="text-xs">Sprout & Scribble Pvt Ltd</p>
        </CardFooter>
      </Card>
    </>
  );
}
