import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SearchBar } from './components/SearchBar';
import { Metrics } from './components/Metrics';
import { PropertyFilter } from './components/PropertyFilter';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailView } from './components/PropertyDetailView';
import { HowItWorks } from './components/HowItWorks';
import { DigitalCheckout } from './components/DigitalCheckout';
import { GuestExperience } from './components/GuestExperience';
import { AboutSection } from './components/AboutSection';
import { Testimonials } from './components/Testimonials';
import { VisualGallery } from './components/VisualGallery';
import { FAQSection } from './components/FAQSection';
import { FinalCTA } from './components/FinalCTA';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { Footer } from './components/Footer';
import { Toast, ToastMessage } from './components/Toast';
import { ThemeToggle } from './components/ThemeToggle';
import { ContactModal } from './components/ContactModal';
import { 
  fetchProperties, 
  subscribeToProperties, 
  saveProperty, 
  deleteProperty, 
  togglePropertyStatus, 
  addUnavailability, 
  removeUnavailability, 
  resetToDefaultData, 
  getUnavailabilities 
} from './lib/dataService';
import { isAdminAuthenticated, adminLogout } from './lib/auth';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout, AdminTab } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminPropertiesList } from './components/admin/AdminPropertiesList';
import { AdminPropertyForm } from './components/admin/AdminPropertyForm';
import { AdminAvailability } from './components/admin/AdminAvailability';
import { AdminReviews } from './components/admin/AdminReviews';
import { AdminSettings } from './components/admin/AdminSettings';

// Storage and Types
import { Property, PropertyCategory, SearchFilterState, PropertyUnavailability } from './types';
import { Sparkles, SlidersHorizontal, RotateCcw, AlertCircle } from 'lucide-react';


export default function App() {
  // --- Admin Mode & Auth State ---
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return window.location.hash === '#admin' || window.location.pathname.startsWith('/admin');
  });
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(() => isAdminAuthenticated());
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isCreatingProperty, setIsCreatingProperty] = useState<boolean>(false);
  const [availabilityPropertyId, setAvailabilityPropertyId] = useState<string>('');
  const [showContactModal, setShowContactModal] = useState<boolean>(false);

  // --- Core Dynamic Properties & Unavailabilities State ---
  const [properties, setProperties] = useState<Property[]>([]);
  const [unavailabilities, setUnavailabilities] = useState<PropertyUnavailability[]>([]);

  // Listen for storage events / updates
  useEffect(() => {
    fetchProperties().then(setProperties);
    getUnavailabilities().then(setUnavailabilities);
    
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminMode(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    const subscription = subscribeToProperties(() => {
      fetchProperties().then(setProperties);
    });

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  // Sync auth state if changed
  useEffect(() => {
    setIsAdminAuth(isAdminAuthenticated());
  }, [isAdminMode]);

  // --- Public Navigation & View state ---
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Search state
  const [searchFilters, setSearchFilters] = useState<SearchFilterState>({
    destination: '',
    checkIn: null,
    checkOut: null,
    guests: { adults: 1, children: 0 },
  });

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [sortOption, setSortOption] = useState<string>('recommended');

  // Favorites state with localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cerrado_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToasts((prev) => {
      // Check if identical message already exists in current toasts
      const exists = prev.some((t) => t.message === message && t.type === type);
      if (exists) return prev;
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      return [...prev, { id, message, type }];
    });
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Admin Handlers ---
  const handleAdminLoginSuccess = () => {
    setIsAdminAuth(true);
    addToast('Bem-vinda ao Painel Administrativo!', 'success');
  };

  const handleAdminLogout = () => {
    adminLogout();
    setIsAdminAuth(false);
    setIsAdminMode(false);
    if (window.location.hash === '#admin') {
      window.location.hash = '';
    }
    addToast('Sessão administrativa encerrada com segurança.', 'info');
  };

  const handleSaveProperty = async (propertyData: Partial<Property> & { name: string; location: string }) => {
    console.log('handleSaveProperty - Iniciando salvamento:', propertyData);
    
    // Garantir valores padrão para campos obrigatórios
    const sanitizedData: Partial<Property> & { name: string; location: string } = {
      ...propertyData,
      status: propertyData.status || 'active',
      category: (propertyData.category && propertyData.category.length > 0 ? propertyData.category : ['apartamentos']) as PropertyCategory[],
      city: propertyData.city || 'Palmas',
      state: propertyData.state || 'TO',
      pricePerNight: propertyData.pricePerNight || 0,
    };
    console.log('handleSaveProperty - Dados sanitizados:', sanitizedData);

    const res = await saveProperty(sanitizedData);
    console.log('handleSaveProperty - Resultado do saveProperty:', res);
    
    if (res.success) {
      const updatedProps = await fetchProperties();
      setProperties(updatedProps);
      setIsCreatingProperty(false);
      setEditingProperty(null);
      addToast(
        editingProperty
          ? 'Imóvel atualizado com sucesso!'
          : 'Novo imóvel cadastrado com sucesso!',
        'success'
      );
    } else {
      const errorMessage = typeof res.error === 'string' 
        ? res.error 
        : 'Erro ao salvar imóvel.';
      console.error('handleSaveProperty - Erro retornado pelo serviço:', errorMessage);
      addToast(errorMessage, 'error');
    }
  };


  const handleDeleteProperty = async (id: string) => {
    const res = await deleteProperty(id);
    if (res.success) {
      const updatedProps = await fetchProperties();
      setProperties(updatedProps);
      // setUnavailabilities(getUnavailabilities()); // Still need proper implementation for unavailabilities
      addToast('Imóvel excluído do sistema.', 'info');
    } else {
      addToast('Erro ao excluir imóvel.', 'error');
    }
  };

  const handleTogglePropertyStatus = async (id: string) => {
    const res = await togglePropertyStatus(id);
    if (res.success && res.property) {
      const updatedProps = await fetchProperties();
      setProperties(updatedProps);
      const isNowActive = res.property.status !== 'inactive';
      addToast(
        isNowActive
          ? `"${res.property.name}" foi publicado no site!`
          : `"${res.property.name}" agora está oculto do site.`,
        'success'
      );
    }
  };

  const handleAddBlock = async (block: Omit<PropertyUnavailability, 'id' | 'createdAt'>) => {
    const res = await addUnavailability(block);
    if (res.success) {
      const [updatedProps, updatedUnavailabilities] = await Promise.all([fetchProperties(), getUnavailabilities()]);
      setUnavailabilities(updatedUnavailabilities);
      setProperties(updatedProps);
    }
    return res;
  };

  const handleRemoveBlock = async (id: string) => {
    const res = await removeUnavailability(id);
    if (res.success) {
      const [updatedProps, updatedUnavailabilities] = await Promise.all([fetchProperties(), getUnavailabilities()]);
      setUnavailabilities(updatedUnavailabilities);
      setProperties(updatedProps);
    }
  };

  const handleResetData = async () => {
    await resetToDefaultData();
    const [updatedProps, updatedUnavailabilities] = await Promise.all([fetchProperties(), getUnavailabilities()]);
    setProperties(updatedProps);
    setUnavailabilities(updatedUnavailabilities);
  };

  const handleNavigateToAvailability = (propertyId: string) => {
    setAvailabilityPropertyId(propertyId);
    setAdminTab('availability');
  };

  const handleViewPropertyOnSite = (property: Property) => {
    setIsAdminMode(false);
    setSelectedProperty(property);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Public Site Favorites Handler ---
  const handleToggleFavorite = (propertyId: string) => {
    setFavorites((prev) => {
      let updated: string[];
      if (prev.includes(propertyId)) {
        updated = prev.filter((id) => id !== propertyId);
        addToast('Imóvel removido dos seus favoritos', 'info');
      } else {
        updated = [...prev, propertyId];
        addToast('Imóvel salvo nos seus favoritos!', 'success');
      }
      try {
        localStorage.setItem('cerrado_favorites', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Handle Search Submission on Public Site
  const handleSearch = (filters: SearchFilterState) => {
    setSearchFilters(filters);
    if (selectedProperty) {
      setSelectedProperty(null);
    }
    setTimeout(() => {
      const el = document.getElementById('imoveis');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    addToast('Filtros de busca aplicados!');
  };

  // Public Filter & Sort Logic (Only active properties)
  const filteredProperties = useMemo(() => {
    // Only show active properties on public site
    let result = properties.filter((p) => p.status !== 'inactive');

    // 1. Destination / Keyword search
    if (searchFilters.destination.trim()) {
      const q = searchFilters.destination.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.neighborhood.toLowerCase().includes(q)
      );
    }

    // 2. Guests count requirement
    const totalGuestsNeeded = searchFilters.guests.adults + searchFilters.guests.children;
    if (totalGuestsNeeded > 1) {
      result = result.filter((p) => p.maxGuests >= totalGuestsNeeded);
    }

    // 3. Category pill filter
    if (selectedCategory === 'favoritos') {
      result = result.filter((p) => favorites.includes(p.id));
    } else if (selectedCategory !== 'todos') {
      result = result.filter((p) => p.category.includes(selectedCategory as any));
    }

    // 4. Date Availability Check (if dates selected)
    if (searchFilters.checkIn && searchFilters.checkOut) {
      const inDate = searchFilters.checkIn;
      const outDate = searchFilters.checkOut;

      result = result.filter((p) => {
        // If property has booked dates that intersect with selected range, exclude it
        const hasOverlap = (p.bookedDates || []).some((dateStr) => dateStr >= inDate && dateStr < outDate);
        return !hasOverlap;
      });
    }

    // 5. Sorting
    if (sortOption === 'price-asc') {
      result.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sortOption === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [properties, searchFilters, selectedCategory, sortOption, favorites]);

  // Reset Filters helper
  const handleResetFilters = () => {
    setSearchFilters({
      destination: '',
      checkIn: null,
      checkOut: null,
      guests: { adults: 1, children: 0 },
    });
    setSelectedCategory('todos');
    setSortOption('recommended');
    addToast('Todos os filtros foram limpos.');
  };

  // ==========================================
  // RENDER: ADMIN PANEL VIEW
  // ==========================================
  if (isAdminMode) {
    if (!isAdminAuth) {
      return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans antialiased text-[#002147]">
          <Toast toasts={toasts} onDismiss={removeToast} />
          <AdminLogin
            onLoginSuccess={handleAdminLoginSuccess}
            onBackToSite={() => {
              setIsAdminMode(false);
              window.location.hash = '';
            }}
          />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#F8F9FA] font-sans antialiased text-[#002147]">
        <Toast toasts={toasts} onDismiss={removeToast} />
        <AdminLayout
          currentTab={adminTab}
          onSelectTab={(tab) => {
            setAdminTab(tab);
          }}
          onLogout={handleAdminLogout}
          onBackToSite={() => {
            setIsAdminMode(false);
            window.location.hash = '';
          }}
          onQuickAddProperty={() => {
            setIsCreatingProperty(true);
            setEditingProperty(null);
          }}
        >
          {/* Dashboard Tab */}
          {adminTab === 'dashboard' && (
            <AdminDashboard
              properties={properties}
              unavailabilities={unavailabilities}
              onNavigateTab={(tab) => setAdminTab(tab)}
              onAddProperty={() => {
                setIsCreatingProperty(true);
                setEditingProperty(null);
              }}
              onManagePropertyAvailability={(propertyId) => {
                if (propertyId) setAvailabilityPropertyId(propertyId);
                setAdminTab('availability');
              }}
              onEditProperty={(prop) => {
                setEditingProperty(prop);
                setIsCreatingProperty(false);
              }}
              onViewPublicSite={() => {
                setIsAdminMode(false);
                window.location.hash = '';
              }}
              onToast={(msg) => addToast(msg, 'success')}
            />
          )}

          {/* Properties Tab */}
          {adminTab === 'properties' && (
            <AdminPropertiesList
              properties={properties}
              onAddProperty={() => {
                setIsCreatingProperty(true);
                setEditingProperty(null);
              }}
              onEditProperty={(prop) => {
                setEditingProperty(prop);
                setIsCreatingProperty(false);
              }}
              onManageAvailability={handleNavigateToAvailability}
              onToggleStatus={handleTogglePropertyStatus}
              onDeleteProperty={handleDeleteProperty}
              onViewOnSite={handleViewPropertyOnSite}
            />
          )}

          {/* Availability Tab */}
          {adminTab === 'availability' && (
            <AdminAvailability
              properties={properties}
              selectedPropertyId={availabilityPropertyId}
              unavailabilities={unavailabilities}
              onAddBlock={handleAddBlock}
              onRemoveBlock={handleRemoveBlock}
              onToast={addToast}
            />
          )}

          {/* Reviews Tab */}
          {adminTab === 'reviews' && (
            <AdminReviews
              properties={properties}
              onRefreshProperties={async () => {
                const updated = await fetchProperties();
                setProperties(updated);
              }}
              onToast={addToast}
            />
          )}

          {/* Settings Tab */}
          {adminTab === 'settings' && (
            <AdminSettings
              onResetDemoData={handleResetData}
              onToast={addToast}
            />
          )}

          {/* Property Add/Edit Modal */}
          {(isCreatingProperty || editingProperty) && (
            <AdminPropertyForm
              property={editingProperty}
              onSave={handleSaveProperty}
              onToast={addToast}
              onCancel={() => {
                setIsCreatingProperty(false);
                setEditingProperty(null);
              }}
            />
          )}
        </AdminLayout>
      </div>
    );
  }

  // ==========================================
  // RENDER: PUBLIC CLIENT-FACING SITE
  // ==========================================
  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans antialiased text-[#002147] selection:bg-[#C5A059] selection:text-white flex flex-col justify-between">
      {/* Global Toast Stack */}
      <Toast toasts={toasts} onDismiss={removeToast} />
      
      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}

      {/* Global Navigation Header */}
      <Header
        onNavigateHome={() => setSelectedProperty(null)}
        isPropertyDetailOpen={!!selectedProperty}
        favoritesCount={favorites.length}
        onOpenFavorites={() => {
          if (selectedProperty) setSelectedProperty(null);
          setSelectedCategory('favoritos');
          setTimeout(() => {
            const el = document.getElementById('imoveis');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 50);
        }}
        onOpenAdmin={() => {
          setIsAdminMode(true);
          window.location.hash = '#admin';
        }}
      />

      {/* Conditional View: Detail View OR Landing Page */}
      {selectedProperty ? (
        <PropertyDetailView
          property={selectedProperty}
          onBack={() => setSelectedProperty(null)}
          onSelectProperty={(prop) => setSelectedProperty(prop)}
          allProperties={properties.filter((p) => p.status !== 'inactive')}
          isFavorite={favorites.includes(selectedProperty.id)}
          onToggleFavorite={handleToggleFavorite}
          onToast={addToast}
          onUpdateProperty={(updated) => {
            setSelectedProperty(updated);
            setProperties((prev) =>
              prev.map((p) => (p.id === updated.id ? updated : p))
            );
          }}
        />
      ) : (
        <main className="flex-1">
          {/* 1. Cinematic Hero Section */}
          <Hero
            onSearch={handleSearch}
            initialFilters={searchFilters}
          />

          {/* 2. Key Metrics & Social Proof */}
          <Metrics />

          {/* 3. Main Property Showcase Section */}
          <section id="imoveis" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Showcase Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 text-[#C5A059] text-xs font-bold uppercase tracking-widest mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Portfólio Exclusivo em Palmas</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
                  Encontre o espaço ideal para você
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 font-light mt-1 max-w-lg">
                  Imóveis selecionados e administrados com rigor para proporcionar estadias impecáveis.
                </p>
              </div>

              {/* Active Results Counter */}
              <div className="text-xs text-neutral-500 font-medium">
                Mostrando <strong className="text-neutral-900 font-bold">{filteredProperties.length}</strong> de {properties.filter((p) => p.status !== 'inactive').length} acomodações ativas
              </div>
            </div>

            {/* Category Pills & Sorting Bar */}
            <PropertyFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              sortOption={sortOption}
              onSelectSort={setSortOption}
              propertiesCount={filteredProperties.length}
            />

            {/* Active search filter warning/clear pill */}
            {(searchFilters.destination || searchFilters.checkIn || selectedCategory !== 'todos') && (
              <div className="flex items-center justify-between bg-white border border-[#E5E0D8] rounded-xl px-4 py-2.5 mb-8 text-xs text-neutral-700">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-[#C5A059]">Filtros ativos:</span>
                  {searchFilters.destination && (
                    <span className="bg-neutral-100 px-2 py-1 rounded-md font-semibold">
                      Destino: "{searchFilters.destination}"
                    </span>
                  )}
                  {searchFilters.checkIn && searchFilters.checkOut && (
                    <span className="bg-neutral-100 px-2 py-1 rounded-md font-semibold">
                      {searchFilters.checkIn.split('-').reverse().join('/')} até {searchFilters.checkOut.split('-').reverse().join('/')}
                    </span>
                  )}
                  {selectedCategory !== 'todos' && (
                    <span className="bg-neutral-100 px-2 py-1 rounded-md font-semibold uppercase">
                      Categoria: {selectedCategory}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleResetFilters}
                  className="text-neutral-500 hover:text-neutral-900 font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0 ml-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpar</span>
                </button>
              </div>
            )}

            {/* Properties Cards Grid */}
            {filteredProperties.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {filteredProperties.map((property) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <PropertyCard
                      property={property}
                      onSelect={(prop) => setSelectedProperty(prop)}
                      onSelectProperty={(prop) => setSelectedProperty(prop)}
                      isFavorite={favorites.includes(property.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E5E0D8] max-w-lg mx-auto my-12 space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#F4EFEA] text-[#C5A059] flex items-center justify-center mx-auto">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-neutral-900">
                  Nenhum imóvel encontrado
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                  Não encontramos imóveis disponíveis para os critérios ou datas selecionadas. Tente ajustar os filtros ou buscar por outra localização.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-[#C5A059] hover:bg-[#735D43] text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  Ver Todos os Imóveis
                </button>
              </div>
            )}
          </section>

          {/* 4. Timeline / Como Funciona */}
          <HowItWorks />

          {/* 5. Digital Check-out Interactive Section */}
          <DigitalCheckout onToast={addToast} />

          {/* 6. Guest Experience Pillars */}
          <GuestExperience />

          {/* 7. Institutional About Section with Real Database Property */}
          <AboutSection 
            properties={properties} 
            onSelectProperty={handleViewPropertyOnSite}
          />

          {/* 8. Verified Guest Testimonials */}
          <Testimonials />

          {/* 9. Visual / Instagram Gallery */}
          <VisualGallery />

          {/* 10. FAQ Accordion */}
          <FAQSection />

          {/* 11. Final Cinematic CTA Banner */}
          <FinalCTA />
        </main>
      )}

      {/* Global Floating WhatsApp Contact Widget */}
      <WhatsAppFloatingButton />

      {/* Global 4-Column Luxury Footer with Admin Access Link */}
      <Footer
        onOpenAdmin={() => {
          setIsAdminMode(true);
          window.location.hash = '#admin';
        }}
      />
    </div>
  );
}
