'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
} from './ui/navigation-menu';
import ThemeToggle from './ThemeToggle';
import ThemePaletteSelector from './ThemePaletteSelector';

export default function NavigationComponent() {
  const pathname = usePathname() ?? '/';
  const showLinks = pathname !== '/';

  return (
    <div className='container mx-auto mt-2 flex items-center justify-between'>
      {/* Left area reserved so right controls remain at the right even when links are hidden */}
      <div className='flex-1'>
        {showLinks && (
          <NavigationMenu className='list-none'>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href='/'>Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href='/hash'>HASH</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href='/ip'>IP</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenu>
        )}
      </div>

      {/* right side controls */}
      <div className='flex items-center gap-2'>
        <ThemePaletteSelector />
        <ThemeToggle />
      </div>
    </div>
  );
}
