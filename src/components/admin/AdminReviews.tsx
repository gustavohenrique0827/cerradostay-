import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  Trash2, 
  Eye, 
  EyeOff, 
  MessageSquareQuote, 
  Building2, 
  Filter, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  ThumbsUp,
  Sparkles,
  MapPin,
  Calendar
} from 'lucide-react';
import { Property, PropertyReview } from '../../types';
import { deletePropertyReview, togglePropertyReviewStatus } from '../../lib/dataService';
import { ConfirmationModal } from './ConfirmationModal';

interface AdminReviewsProps {
  properties: Property[];
  onRefreshProperties: () => Promise<void>;
  onToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminReviews: React.FC<AdminReviewsProps> = ({
  properties,
  onRefreshProperties,
  onToast,
}) => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'hidden'>('all');

  // Confirmation Modal state for deletion
  const [deletingReview, setDeletingReview] = useState<{
    propertyId: string;
    propertyName: string;
    review: PropertyReview;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Flatten all reviews with their parent property context
  const allReviewsWithProperty = useMemo(() => {
    const list: {
      propertyId: string;
      propertyName: string;
      propertyImage: string;
      propertyNeighborhood: string;
      review: PropertyReview;
    }[] = [];

    properties.forEach((prop) => {
      if (Array.isArray(prop.reviews)) {
        prop.reviews.forEach((rev) => {
          list.push({
            propertyId: prop.id,
            propertyName: prop.name,
            propertyImage: prop.coverImage || (prop.images && prop.images[0]) || '',
            propertyNeighborhood: prop.neighborhood || prop.location,
            review: rev,
          });
        });
      }
    });

    return list;
  }, [properties]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return allReviewsWithProperty.filter((item) => {
      // 1. Property filter
      if (selectedPropertyId !== 'all' && item.propertyId !== selectedPropertyId) {
        return false;
      }

      // 2. Rating filter
      if (selectedRating !== 'all' && item.review.rating !== Number(selectedRating)) {
        return false;
      }

      // 3. Status filter
      if (statusFilter === 'approved' && item.review.status === 'hidden') {
        return false;
      }
      if (statusFilter === 'hidden' && item.review.status !== 'hidden') {
        return false;
      }

      // 4. Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const authorMatch = item.review.authorName.toLowerCase().includes(query);
        const commentMatch = item.review.comment.toLowerCase().includes(query);
        const propMatch = item.propertyName.toLowerCase().includes(query);
        return authorMatch || commentMatch || propMatch;
      }

      return true;
    });
  }, [allReviewsWithProperty, selectedPropertyId, selectedRating, statusFilter, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const total = allReviewsWithProperty.length;
    if (total === 0) {
      return { total: 0, average: '5.0', fiveStars: 0, hiddenCount: 0 };
    }
    const sum = allReviewsWithProperty.reduce((acc, curr) => acc + curr.review.rating, 0);
    const avg = (sum / total).toFixed(2);
    const fiveStars = allReviewsWithProperty.filter((r) => r.review.rating === 5).length;
    const hiddenCount = allReviewsWithProperty.filter((r) => r.review.status === 'hidden').length;

    return { total, average: avg, fiveStars, hiddenCount };
  }, [allReviewsWithProperty]);

  // Handle Review Deletion
  const handleConfirmDelete = async () => {
    if (!deletingReview) return;
    setIsDeleting(true);
    const res = await deletePropertyReview(deletingReview.propertyId, deletingReview.review.id);
    setIsDeleting(false);

    if (res.success) {
      onToast('Avaliação excluída com sucesso. A média de notas foi recalculada.', 'success');
      await onRefreshProperties();
      setDeletingReview(null);
    } else {
      onToast(res.error || 'Erro ao excluir avaliação.', 'error');
    }
  };

  // Handle Toggle Visibility
  const handleToggleStatus = async (propertyId: string, reviewId: string, currentStatus?: string) => {
    const res = await togglePropertyReviewStatus(propertyId, reviewId);
    if (res.success) {
      const isNowHidden = currentStatus !== 'hidden';
      onToast(
        isNowHidden
          ? 'Avaliação ocultada do site público.'
          : 'Avaliação agora está visível no site público.',
        'info'
      );
      await onRefreshProperties();
    } else {
      onToast(res.error || 'Erro ao alterar visibilidade.', 'error');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#C5A059] text-xs font-bold uppercase tracking-wider mb-1">
            <MessageSquareQuote className="w-4 h-4" />
            <span>Moderação & Controle</span>
          </div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-neutral-900">
            Avaliações dos Hóspedes
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Acompanhe comentários, notas de 1 a 5 estrelas e modere (aprove, oculte ou exclua) avaliações do site.
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Total de Avaliações</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <MessageSquareQuote className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">{stats.total}</p>
          <p className="text-[11px] text-neutral-400 mt-1">Em todo o portfólio</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Média Geral</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 flex items-center gap-1.5">
            {stats.average}
            <span className="text-sm font-sans font-normal text-amber-500">★</span>
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">Escala de 1 a 5 estrelas</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Notas 5 Estrelas</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ThumbsUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-emerald-700">{stats.fiveStars}</p>
          <p className="text-[11px] text-neutral-400 mt-1">
            {stats.total > 0 ? Math.round((stats.fiveStars / stats.total) * 100) : 0}% de satisfação máxima
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Comentários Ocultos</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <EyeOff className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">{stats.hiddenCount}</p>
          <p className="text-[11px] text-neutral-400 mt-1">Não visíveis ao público</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por hóspede, texto do comentário ou imóvel..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 bg-neutral-50 focus:bg-white focus:outline-hidden focus:border-[#C5A059]"
            />
          </div>

          {/* Property Selector Filter */}
          <div className="w-full md:w-64">
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-800 bg-neutral-50 focus:bg-white focus:outline-hidden focus:border-[#C5A059]"
            >
              <option value="all">Todos os imóveis ({properties.length})</option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({(p.reviews || []).length} avaliações)
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div className="w-full md:w-44">
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-800 bg-neutral-50 focus:bg-white focus:outline-hidden focus:border-[#C5A059]"
            >
              <option value="all">Todas as notas</option>
              <option value="5">⭐️⭐️⭐️⭐️⭐️ 5 estrelas</option>
              <option value="4">⭐️⭐️⭐️⭐️ 4 estrelas</option>
              <option value="3">⭐️⭐️⭐️ 3 estrelas</option>
              <option value="2">⭐️⭐️ 2 estrelas</option>
              <option value="1">⭐️ 1 estrela</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-44">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-800 bg-neutral-50 focus:bg-white focus:outline-hidden focus:border-[#C5A059]"
            >
              <option value="all">Todos os status</option>
              <option value="approved">Apenas visíveis</option>
              <option value="hidden">Apenas ocultos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-neutral-200/80 shadow-xs">
          <MessageSquareQuote className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-lg text-neutral-900">Nenhuma avaliação encontrada</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
            Não foram encontradas avaliações para os filtros selecionados. Tente alterar o termo de busca ou selecionar outro imóvel.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((item) => {
            const isHidden = item.review.status === 'hidden';

            return (
              <motion.div
                key={`${item.propertyId}-${item.review.id}`}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isHidden
                    ? 'bg-neutral-50/80 border-neutral-200 opacity-75'
                    : 'bg-white border-neutral-200/80 shadow-xs hover:border-[#C5A059]/40'
                }`}
              >
                <div>
                  {/* Property Header */}
                  <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-neutral-100">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {item.propertyImage && (
                        <img
                          src={item.propertyImage}
                          alt={item.propertyName}
                          className="w-9 h-9 rounded-lg object-cover shrink-0 border border-neutral-200"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-neutral-900 truncate">
                          {item.propertyName}
                        </p>
                        <p className="text-[10px] text-neutral-400 flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5" />
                          {item.propertyNeighborhood}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isHidden
                          ? 'bg-neutral-200 text-neutral-600'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {isHidden ? 'Oculto do Site' : 'Visível no Site'}
                      </span>
                    </div>
                  </div>

                  {/* Author & Rating */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.review.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={item.review.authorName}
                        className="w-8 h-8 rounded-full object-cover border border-neutral-200"
                      />
                      <div>
                        <p className="text-xs font-bold text-neutral-900 leading-tight">
                          {item.review.authorName}
                        </p>
                        <p className="text-[10px] text-neutral-400">
                          {item.review.authorLocation} · {item.review.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-500 bg-amber-50/80 px-2 py-1 rounded-lg border border-amber-200/50">
                      {[...Array(item.review.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3 h-3 fill-amber-500" />
                      ))}
                      <span className="text-[11px] font-bold text-neutral-800 ml-1">
                        {item.review.rating}.0
                      </span>
                    </div>
                  </div>

                  {/* Comment Body */}
                  <p className="text-xs text-neutral-700 leading-relaxed italic bg-neutral-50/50 p-3 rounded-xl border border-neutral-100">
                    "{item.review.comment}"
                  </p>
                </div>

                {/* Moderation Actions */}
                <div className="flex items-center justify-between gap-2 pt-3 mt-4 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(item.propertyId, item.review.id, item.review.status)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    {isHidden ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Publicar no Site</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Ocultar do Site</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDeletingReview({
                        propertyId: item.propertyId,
                        propertyName: item.propertyName,
                        review: item.review,
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir Avaliação</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal for Review Deletion */}
      <ConfirmationModal
        isOpen={Boolean(deletingReview)}
        title="Excluir Avaliação Definitivamente?"
        description={`Você está prestes a remover o comentário de "${deletingReview?.review.authorName}" do imóvel "${deletingReview?.propertyName}".`}
        itemName={`Avaliação de ${deletingReview?.review.authorName} (${deletingReview?.review.rating} estrelas)`}
        itemTypeLabel="Comentário do Hóspede"
        consequences={[
          'O comentário será permanentemente excluído.',
          'A média geral de estrelas e a contagem de avaliações do imóvel serão recalculadas.',
          'Essa ação é irreversível.',
        ]}
        confirmButtonText="Sim, Excluir Avaliação"
        cancelButtonText="Cancelar"
        variant="danger"
        requireCheckboxConfirmation={false}
        isProcessing={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingReview(null)}
      />
    </div>
  );
};
