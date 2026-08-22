import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { CategoryIcon } from './AppIcons';

interface CategoryCardProps {
  category: {
    id: number;
    name: string;
    icon: string;
    count: number;
    popular: boolean;
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/profissionais?categoria=${encodeURIComponent(category.name)}`);
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.015 }} whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="relative cursor-pointer rounded-2xl border border-white/12 bg-white/[0.07] p-4 shadow-xl shadow-black/10 transition-all duration-300 hover:border-[#FFD100]/50 hover:bg-white/[0.10]"
    >
      {category.popular && (
        <div className="absolute right-2 top-2 rounded-full bg-[#FFD100] px-1.5 py-0.5 text-[9px] font-bold text-[#071327]">
          POPULAR
        </div>
      )}
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFD100]/10">
        <CategoryIcon name={category.icon} size={28} />
      </div>
      <h3 className="text-sm font-bold leading-tight text-white">{category.name}</h3>
      <p className="mt-0.5 text-xs text-white/45">{category.count} disponíveis</p>
    </motion.div>
  );
}
