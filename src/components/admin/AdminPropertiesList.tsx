import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit3, 
  Calendar, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  EyeOff, 
  MapPin, 
  Users, 
  Bed, 
  Bath, 
  SlidersHorizontal,
  ArrowUpRight,
  Sparkles,
  AlertTriangle,
  LayoutGrid,
  List,
  X,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Property } from '../../types';
import { ConfirmationModal } from './ConfirmationModal';

interface AdminPropertiesListProps {
  properties: Property[];
  onAddProperty: () => void;
  onEditProperty: (property: Property) => void;
  onManageAvailability: (propertyId: string) => void;
  onToggleStatus: (propertyId: string) => void;
  onDeleteProperty: (propertyId: string) => void;
  onViewOnSite: (property: Property) => void;
}

export const AdminPropertiesList: React.FC<AdminPropertiesListProps> = ({
  properties,
  onAddProperty,
  onEditProperty,
  onManageAvailability,
  onToggleStatus,
  onDeleteProperty,
  onViewOnSite,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  // Filtered properties
  const filtered = properties.filter((p) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = 
      !term ||
      p.name.toLowerCase().includes(term) ||
      (p.neighborhood && p.neighborhood.toLowerCase().includes(term)) ||
      p.location.toLowerCase().includes(term) ||
      p.city.toLowerCase().includes(term);

    const isInactive = p.status === 'inactive';
    if (statusFilter === 'active' && isInactive) return false;
    if (statusFilter === 'inactive' && !isInactive) return false;

    return matchesSearch;
  });

  const confirmDelete = () => {
    if (propertyToDelete) {
      onDeleteProperty(propertyToDelete.id);
      setPropertyToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-[#C5A059] text-xs font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>Portfólio de Imóveis</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
            Gestão de Imóveis
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-light mt-0.5">
            Gerencie preços, fotos, regras, status público e o calendário de cada acomodação em Palmas.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddProperty}
          className="bg-[#002147] hover:bg-[#C5A059] text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs hover:shadow-md cursor-pointer shrink-0 min-h-[42px] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Imóvel</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-[#DEE2E6] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, condomínio, orla, graciosa..."
            className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-hidden focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 focus:bg-white transition-all text-neutral-900 placeholder:text-neutral-400"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between md:justify-end gap-2.5 flex-wrap">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-neutral-900 shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Todos ({properties.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'active'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Ativos ({properties.filter((p) => p.status !== 'inactive').length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('inactive')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'inactive'
                  ? 'bg-white text-neutral-800 shadow-2xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-neutral-400" />
              Inativos ({properties.filter((p) => p.status === 'inactive').length})
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center gap-1 bg-neutral-100 p-1 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-neutral-600 transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-neutral-900 shadow-2xs' : 'hover:text-neutral-900'
              }`}
              title="Visualização em Grade"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-neutral-600 transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-neutral-900 shadow-2xs' : 'hover:text-neutral-900'
              }`}
              title="Visualização em Tabela"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Properties List / Grid */}
      {filtered.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((property) => {
              const isActive = property.status !== 'inactive';

              return (
                <div
                  key={property.id}
                  className={`bg-white rounded-3xl overflow-hidden border transition-all shadow-xs hover:shadow-md flex flex-col justify-between group ${
                    isActive ? 'border-[#DEE2E6]' : 'border-neutral-200 opacity-80 bg-neutral-50/50'
                  }`}
                >
                  {/* Image and Status Header */}
                  <div>
                    <div className="relative h-52 w-full overflow-hidden bg-neutral-100">
                      <img
                        src={property.coverImage}
                        alt={property.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                      {/* Status Pill Top Left */}
                      <div className="absolute top-3 left-3 z-10">
                        <button
                          type="button"
                          onClick={() => onToggleStatus(property.id)}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md shadow-xs cursor-pointer transition-colors border ${
                            isActive
                              ? 'bg-emerald-600/90 text-white hover:bg-emerald-700 border-emerald-400/40'
                              : 'bg-neutral-800/90 text-white hover:bg-neutral-900 border-neutral-700'
                          }`}
                          title="Clique para alternar o status público"
                        >
                          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-neutral-400'}`} />
                          <span>{isActive ? 'Ativo no site' : 'Inativo / Oculto'}</span>
                        </button>
                      </div>

                      {/* Price Badge Top Right */}
                      <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-white px-3 py-1 rounded-xl text-xs font-bold shadow-xs border border-white/20">
                        R$ {property.pricePerNight} <span className="text-[10px] font-normal text-neutral-300">/noite</span>
                      </div>

                      {/* Badge / Category Pill Bottom Left */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                        {property.badge && (
                          <span className="bg-[#C5A059] text-white px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-xs">
                            {property.badge}
                          </span>
                        )}
                        <span className="bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-md text-[10px] font-medium">
                          {(property.images?.length || 1)} fotos
                        </span>
                      </div>
                    </div>

                    {/* Property Info Content */}
                    <div className="p-5 sm:p-6 space-y-3">
                      <div className="flex items-center gap-1 text-xs text-[#C5A059] font-medium">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{property.neighborhood || property.location} &bull; Palmas, TO</span>
                      </div>

                      <h3 className="font-serif font-bold text-lg text-neutral-900 line-clamp-1 group-hover:text-[#002147] transition-colors">
                        {property.name}
                      </h3>

                      <p className="text-xs text-neutral-500 font-light line-clamp-2 leading-relaxed">
                        {property.tagline || property.description}
                      </p>

                      {/* Specs / Capacities */}
                      <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-2xl bg-neutral-50 border border-neutral-100 text-xs text-neutral-700 font-medium text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>{property.maxGuests} hós.</span>
                        </div>
                        <div className="flex items-center justify-center gap-1 border-x border-neutral-200/80">
                          <Bed className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>{property.bedrooms} qtos</span>
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <Bath className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>{property.bathrooms} banh.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Buttons (Footer) */}
                  <div className="p-5 sm:p-6 pt-0 border-t border-neutral-100 mt-1">
                    <div className="pt-4 space-y-2">
                      {/* Primary Availability Button */}
                      <button
                        type="button"
                        onClick={() => onManageAvailability(property.id)}
                        className="w-full bg-[#FAF7F2] hover:bg-[#F2ECE4] text-[#C5A059] border border-[#C5A059]/30 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[40px]"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Gerenciar Calendário</span>
                      </button>

                      {/* Secondary Actions (Edit, View, Delete) */}
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => onEditProperty(property)}
                          className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer min-h-[36px]"
                          title="Editar todas as informações do imóvel"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-neutral-600" />
                          <span>Editar</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onViewOnSite(property)}
                          className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer min-h-[36px]"
                          title="Visualizar no site público"
                        >
                          <Eye className="w-3.5 h-3.5 text-neutral-600" />
                          <span>Ver Site</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPropertyToDelete(property)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer min-h-[36px]"
                          title="Excluir imóvel do sistema"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Excluir</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table / List View */
          <div className="bg-white rounded-3xl border border-[#DEE2E6] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-700">
                <thead className="bg-[#FAF9F7] text-[11px] font-bold uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
                  <tr>
                    <th className="py-4 px-6">Imóvel</th>
                    <th className="py-4 px-4">Localização</th>
                    <th className="py-4 px-4">Diária</th>
                    <th className="py-4 px-4">Capacidade</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-6 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filtered.map((property) => {
                    const isActive = property.status !== 'inactive';
                    return (
                      <tr key={property.id} className="hover:bg-[#FAF9F7] transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3 min-w-[200px]">
                            <img
                              src={property.coverImage}
                              alt={property.name}
                              className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shrink-0"
                            />
                            <div>
                              <p className="font-serif font-bold text-sm text-neutral-900 truncate max-w-xs">
                                {property.name}
                              </p>
                              <p className="text-[11px] text-neutral-400 truncate max-w-xs">
                                {property.tagline || property.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-neutral-700 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>{property.neighborhood || property.location}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="font-bold text-neutral-900 text-sm">
                            R$ {property.pricePerNight}
                          </span>
                          <span className="text-neutral-400 text-[10px]"> /noite</span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-neutral-600 font-medium">
                            <span>{property.maxGuests} hós.</span>
                            <span>&bull;</span>
                            <span>{property.bedrooms} qtos</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => onToggleStatus(property.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer ${
                              isActive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-neutral-200 text-neutral-700'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-600' : 'bg-neutral-500'}`} />
                            <span>{isActive ? 'Ativo' : 'Oculto'}</span>
                          </button>
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => onManageAvailability(property.id)}
                              className="p-2 rounded-xl text-[#C5A059] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                              title="Gerenciar calendário"
                            >
                              <Calendar className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onEditProperty(property)}
                              className="p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                              title="Editar imóvel"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onViewOnSite(property)}
                              className="p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                              title="Ver no site público"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setPropertyToDelete(property)}
                              className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Excluir imóvel"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-[#DEE2E6] max-w-md mx-auto my-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
            <Building2 className="w-7 h-7" />
          </div>
          <h3 className="font-serif font-bold text-xl text-neutral-900">
            Nenhum imóvel encontrado
          </h3>
          <p className="text-xs text-neutral-500 font-light leading-relaxed">
            {searchTerm || statusFilter !== 'all'
              ? 'Nenhum imóvel corresponde aos filtros ou termo de busca informado.'
              : 'Você ainda não possui imóveis cadastrados nesta conta.'}
          </p>
          <button
            type="button"
            onClick={onAddProperty}
            className="bg-[#002147] hover:bg-[#C5A059] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
          >
            + Cadastrar Novo Imóvel
          </button>
        </div>
      )}

      {/* Modern Global Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={!!propertyToDelete}
        title="Excluir Imóvel do Portfólio"
        description="Esta ação removerá este imóvel de forma permanente da sua base de dados. Todas as informações públicas e fotos deixarão de ser exibidas no site."
        itemName={propertyToDelete?.name}
        itemTypeLabel="Imóvel selecionado"
        consequences={[
          'O anúncio será removido imediatamente do site público e dos resultados de busca.',
          'Todos os bloqueios de calendário e histórico de indisponibilidades vinculados serão excluídos.',
          'As imagens associadas serão desvinculadas.',
          'Esta operação é irreversível.',
        ]}
        confirmButtonText="Sim, Excluir Imóvel"
        cancelButtonText="Cancelar"
        variant="danger"
        icon="trash"
        requireCheckboxConfirmation={true}
        checkboxLabel="Confirmo que desejo apagar permanentemente este imóvel do sistema."
        onConfirm={confirmDelete}
        onCancel={() => setPropertyToDelete(null)}
      />
    </div>
  );
};
