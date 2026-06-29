import { Link, useLocation } from 'react-router';
import { Home, Search, ClipboardList, Heart, User } from 'lucide-react';

const tabs = [
  { label: 'Início', to: '/', icon: Home },
  { label: 'Buscar', to: '/profissionais', icon: Search },
  { label: 'Pedidos', to: '/acompanhamento', icon: ClipboardList },
  { label: 'Favoritos', to: '/favoritos', icon: Heart },
  { label: 'Perfil', to: '/cliente', icon: User },
];

export function MobileNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0A1628] border-t border-white/10">
      <div className="flex">
        {tabs.map(({ label, to, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors"
            >
              <Icon
                size={20}
                className={active ? 'text-[#FFD100]' : 'text-white/40'}
                fill={active ? '#FFD100' : 'none'}
              />
              <span className={`text-[10px] font-medium ${active ? 'text-[#FFD100]' : 'text-white/40'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
