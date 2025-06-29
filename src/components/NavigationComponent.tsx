import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
} from './ui/navigation-menu';

export default function NavigationComponent() {
  return (
    <div className='container mx-auto mt-2'>
      <NavigationMenu className='list-none'>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href='/ioc'>Ioc</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href='/ip'>Ip</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenu>
    </div>
  );
}
