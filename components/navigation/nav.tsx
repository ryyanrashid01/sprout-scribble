import { auth } from "@/server/auth";
import { UserButton } from "./user-button";
import Link from "next/link";
import Logo from "./logo";
import LoginButton from "./login-button";
import CartDrawer from "@/components/cart/cart-drawer";

export default async function Nav() {
  const session = await auth();

  return (
    <header>
      <nav className="py-8">
        <ul className="flex justify-between items-center md:gap-8 gap-4 md:flex-row flex-row">
          <li className="flex flex-1">
            <Link href="/" aria-label="sprout and scribble logo">
              <Logo />
            </Link>
          </li>
          <li className="relative flex items-center group">
            <CartDrawer session={session} />
          </li>
          {!session ? (
            <LoginButton />
          ) : (
            <li className="flex items-center">
              <UserButton user={session?.user} expires={session?.expires} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
