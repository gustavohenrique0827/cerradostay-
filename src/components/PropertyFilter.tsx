import React from 'react';
import { PropertyCategory } from '../types';
import { CATEGORIES_LIST } from '../data/categories';
import { 
  Sparkles, Building2, Home, Crown, Compass, Palmtree, Users, Dog, 
  SlidersHorizontal, X, ArrowDownUp 
} from 'lucide-react';

interface PropertyFilterProps {
  selectedCategory: PropertyCategory | string;
  onSelectCategory: (category: any) => void;
  activeDestination?: string;
  onClearDestination?: () => void;
  totalCount?: number;
  propertiesCount?: number;
  sortBy?: string;
  sortOption?: string;
  onSortChange?: (sort: any) => void;
  onSelectSort?: (sort: any) => void;
}

const iconMap = {
  Sparkles,
  Building2,
  Home,
  Crown,
  Compass,
  Palmtree,
  Users,
  Dog,
};

export const PropertyFilter: React.FC<PropertyFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  activeDestination,
  onClearDestination,
  totalCount,
  propertiesCount,
  sortBy,
  sortOption,
  onSortChange,
  onSelectSort,
}) => {
  const currentCount = totalCount !== undefined ? totalCount : (propertiesCount !== undefined ? propertiesCount : 0);
  const currentSort = sortBy || sortOption || 'featured';

  const handleSortChange = (newSort: string) => {
    if (onSortChange) onSortChange(newSort);
    if (onSelectSort) onSelectSort(newSort);
  };
  return (
    <div className="w-full space-y-4 mb-8">
      {/* Category Pills Horizontal Scrollable Bar */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-2">
        <div className="flex items-center gap-2">
          {CATEGORIES_LIST.map((cat) => {
            const Icon = iconMap[cat.icon as keyof typeof iconMap] || Sparkles;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                id={`filter-pill-${cat.id}`}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#002147] text-white shadow-xs'
                    : 'bg-white text-neutral-700 hover:bg-[#F8F9FA] border border-[#DEE2E6]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#D4AF37]' : 'text-neutral-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Info Bar & Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#DEE2E6] text-xs text-neutral-600">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium">
            Exibindo <strong className="text-neutral-900 font-bold">{currentCount}</strong> {currentCount === 1 ? 'imóvel disponível' : 'imóveis disponíveis'}
          </span>

          {activeDestination && (
            <span className="inline-flex items-center gap-1.5 bg-[#FBF7EF] text-[#C5A059] px-2.5 py-1 rounded-full font-medium border border-[#C5A059]/20">
              <span>Destino: <strong>{activeDestination}</strong></span>
              {onClearDestination && (
                <button
                  onClick={onClearDestination}
                  className="hover:text-neutral-900 ml-0.5"
                  title="Limpar filtro de destino"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 ml-auto">
          <ArrowDownUp className="w-3.5 h-3.5 text-neutral-400" />
          <span className="font-medium text-neutral-500 hidden sm:inline">Ordenar por:</span>
          <select
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-white border border-[#DEE2E6] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#002147] outline-none focus:border-[#C5A059] cursor-pointer"
            id="properties-sort-select"
          >
            <option value="featured">Destaques Cerrado</option>
            <option value="recommended">Destaques Cerrado</option>
            <option value="rating">Mais Bem Avaliados (★)</option>
            <option value="price_asc">Menor Preço por Noite</option>
            <option value="price-asc">Menor Preço por Noite</option>
            <option value="price_desc">Maior Preço por Noite</option>
            <option value="price-desc">Maior Preço por Noite</option>
          </select>
        </div>
      </div>
    </div>
  );
};
