import {
  AirVent,
  Armchair,
  BadgeCheck,
  Bell,
  Bolt,
  BriefcaseBusiness,
  BrickWall,
  Brush,
  Check,
  CircleDollarSign,
  ClipboardCheck,
  Eye,
  Fan,
  Hammer,
  HardHat,
  Home,
  KeyRound,
  Leaf,
  MailCheck,
  MapPin,
  PaintRoller,
  Search,
  ShieldCheck,
  Sparkles,
  SprayCan,
  Star,
  Tag,
  Truck,
  UserRound,
  Wrench,
} from 'lucide-react';

const categoryIcons = {
  eletricista: Bolt,
  encanador: Wrench,
  pedreiro: BrickWall,
  pintor: PaintRoller,
  diarista: SprayCan,
  arcondicionado: AirVent,
  jardineiro: Leaf,
  montador: Hammer,
  chaveiro: KeyRound,
  marceneiro: Armchair,
  gesseiro: HardHat,
  gerais: BriefcaseBusiness,
};

const statusIcons = {
  sent: MailCheck,
  viewed: Eye,
  quote: CircleDollarSign,
  confirmed: ClipboardCheck,
  route: Truck,
  progress: Wrench,
  done: Check,
};

type IconProps = {
  name: keyof typeof categoryIcons | keyof typeof statusIcons | string;
  size?: number;
  className?: string;
  filled?: boolean;
};

export function CategoryIcon({ name, size = 26, className = 'text-[#FFD100]' }: IconProps) {
  const Icon = categoryIcons[name as keyof typeof categoryIcons] ?? BriefcaseBusiness;
  return <Icon size={size} className={className} strokeWidth={2.2} />;
}

export function StatusIcon({ name, size = 18, className = 'text-current' }: IconProps) {
  const Icon = statusIcons[name as keyof typeof statusIcons] ?? Check;
  return <Icon size={size} className={className} strokeWidth={2.3} />;
}

export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex h-10 w-10 items-center justify-center ${className}`}>
      <div className="absolute left-0 top-2 h-0.5 w-4 rounded-full bg-[#FFD100]" />
      <div className="absolute left-1 top-4 h-0.5 w-5 rounded-full bg-[#FFD100]" />
      <div className="absolute left-0 top-6 h-0.5 w-3 rounded-full bg-[#FFD100]" />
      <div className="absolute right-0 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-[#14233E] shadow-lg">
        <MapPin size={18} className="text-white" strokeWidth={2.5} />
      </div>
      <Sparkles size={13} className="absolute right-2 top-2 text-[#FFD100]" strokeWidth={2.5} />
    </div>
  );
}

export function BadgeIcon({ type, className = 'text-[#FFD100]' }: { type: 'star' | 'tag' | 'shield' | 'bell' | 'user'; className?: string }) {
  const icons = {
    star: Star,
    tag: Tag,
    shield: ShieldCheck,
    bell: Bell,
    user: UserRound,
  };
  const Icon = icons[type];
  return <Icon size={18} className={className} strokeWidth={2.3} />;
}
