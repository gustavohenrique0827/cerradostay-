import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Upload, 
  Plus, 
  Trash2, 
  Star, 
  Check, 
  Info, 
  Image as ImageIcon, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  X,
  FileText,
  DollarSign,
  Users,
  Bed,
  Bath,
  MapPin,
  Clock,
  AlertCircle,
  AlertTriangle,
  Loader2,
  Sliders,
  CheckCheck,
  Eye,
  EyeOff,
  Navigation,
  ExternalLink,
  Compass
} from 'lucide-react';
import { Property, PropertyCategory, PropertyStatus } from '../../types';
import { 
  Coordinates, 
  PALMAS_REGIONS, 
  resolvePalmasCoordinates, 
  getGoogleMapsSearchUrl, 
  getGoogleMapsDirectionsUrl,
  getGoogleMapsEmbedUrl 
} from '../../utils/geoUtils';

interface AdminPropertyFormProps {
  property?: Property | null; // If null, mode is create
  onSave: (propertyData: Partial<Property> & { name: string; location: string }) => void;
  onCancel: () => void;
  onToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

const PRESET_AMENITIES = [
  'Wi-Fi Ultra-Rápido',
  'Ar-Condicionado Inverter',
  'Piscina Privativa / Aquecida',
  'Churrasqueira Gourmet',
  'Garagem Coberta',
  'Cozinha Completa Equipada',
  'Smart TV 4K com Streaming',
  'Máquina de Lavar / Secar',
  'Banheira / Jacuzzi Panorâmica',
  'Vista Panorâmica para o Lago',
  'Píer / Acesso ao Lago',
  'Área Externa & Jardim',
  'Espaço Home Office',
  'Fechadura Eletrônica Inteligente',
  'Portaria / Segurança 24h',
  'Pet Friendly',
  'Roupas de Cama & Banho 400 Fios',
  'Cafeteira Nespresso',
];

const PRESET_CATEGORIES: { id: PropertyCategory; label: string }[] = [
  { id: 'apartamentos', label: 'Apartamentos' },
  { id: 'casas', label: 'Casas & Mansões' },
  { id: 'luxo', label: 'Alto Padrão / Luxo' },
  { id: 'praia', label: 'Orla & Beira Lago' },
  { id: 'centro', label: 'Centro & Executivo' },
  { id: 'familia', label: 'Família & Grupos' },
  { id: 'pet_friendly', label: 'Pet Friendly' },
];

export const AdminPropertyForm: React.FC<AdminPropertyFormProps> = ({
  property,
  onSave,
  onCancel,
  onToast,
}) => {
  const isEditing = !!property;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields State
  const [name, setName] = useState(property?.name || '');
  const [tagline, setTagline] = useState(property?.tagline || '');
  const [description, setDescription] = useState(property?.description || '');
  const [location, setLocation] = useState(property?.location || '');
  const [neighborhood, setNeighborhood] = useState(property?.neighborhood || '');
  const [address, setAddress] = useState(property?.address || '');
  const [city, setCity] = useState(property?.city || 'Palmas');
  const [state, setState] = useState(property?.state || 'TO');
  const [status, setStatus] = useState<PropertyStatus>(property?.status || 'active');

  // Coordinates State for real-time Google Maps
  const [coordinates, setCoordinates] = useState<Coordinates>(() => {
    if (property?.coordinates && Number.isFinite(property.coordinates.lat) && Number.isFinite(property.coordinates.lng)) {
      return property.coordinates;
    }
    return resolvePalmasCoordinates(`${property?.name || ''} ${property?.location || ''} ${property?.neighborhood || ''} ${property?.address || ''}`);
  });
  const [isManualCoords, setIsManualCoords] = useState<boolean>(false);

  // Auto-update coordinates based on location/address when not manually overridden
  useEffect(() => {
    if (!isManualCoords) {
      const resolved = resolvePalmasCoordinates(`${name} ${location} ${neighborhood} ${address}`);
      setCoordinates(resolved);
    }
  }, [name, location, neighborhood, address, isManualCoords]);

  const [categories, setCategories] = useState<PropertyCategory[]>(
    property?.category || ['apartamentos']
  );

  const [pricePerNight, setPricePerNight] = useState<string | number>(property?.pricePerNight ?? '');
  const [cleaningFee, setCleaningFee] = useState<string | number>(property?.cleaningFee ?? '');
  const [maxGuests, setMaxGuests] = useState<string | number>(property?.maxGuests ?? '');
  const [bedrooms, setBedrooms] = useState<string | number>(property?.bedrooms ?? '');
  const [beds, setBeds] = useState<string | number>(property?.beds ?? '');
  const [bathrooms, setBathrooms] = useState<string | number>(property?.bathrooms ?? '');

  // Photos State
  const [coverImage, setCoverImage] = useState<string>(
    property?.coverImage || ''
  );
  const [images, setImages] = useState<string[]>(
    property?.images || []
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingImages, setIsProcessingImages] = useState(false);
  const [processingProgress, setProcessingProgress] = useState('');

  // Amenities & Rules
  const [amenities, setAmenities] = useState<string[]>(
    property?.amenities || []
  );
  const [newCustomAmenity, setNewCustomAmenity] = useState('');

  const [badge, setBadge] = useState(property?.badge || '');
  const [isSuperhost, setIsSuperhost] = useState<boolean>(property?.isSuperhost ?? false);
  const [checkInTime, setCheckInTime] = useState(property?.checkInTime || '15:00');
  const [checkOutTime, setCheckOutTime] = useState(property?.checkOutTime || '11:00');

  const [houseRules, setHouseRules] = useState<string[]>(
    property?.houseRules || []
  );
  const [newRuleText, setNewRuleText] = useState('');

  const [longDescriptionText, setLongDescriptionText] = useState<string>(
    property?.longDescription?.join('\n\n') || ''
  );

  // Field interaction tracking
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Real-Time Visual Validation Computations
  const validationErrors = useMemo(() => {
    const errs: Record<string, string> = {};

    // 1. Title / Name Validation
    if (!name || !name.trim()) {
      errs.name = 'O título do imóvel é obrigatório.';
    } else if (name.trim().length < 4) {
      errs.name = 'O título deve ter no mínimo 4 caracteres.';
    }

    // 2. Location Validation
    if (!location || !location.trim()) {
      errs.location = 'A localização ou bairro em Palmas é obrigatória.';
    } else if (location.trim().length < 3) {
      errs.location = 'Informe uma localização válida (ex: Orla 14, Graciosa).';
    }

    // 3. Price Validation - Any value allowed
    // 4. Capacity Validation - Any value allowed

    // 5. Photos Validation
    if (!coverImage && images.length === 0) {
      errs.coverImage = 'Adicione pelo menos uma foto para a capa do imóvel.';
    }

    return errs;
  }, [name, location, pricePerNight, maxGuests, coverImage, images]);

  const isValid = Object.keys(validationErrors).length === 0;

  // Validation metrics for health bar
  const requiredFields = [
    { key: 'name', label: 'Título', valid: !validationErrors.name },
    { key: 'location', label: 'Localização', valid: !validationErrors.location },
    { key: 'pricePerNight', label: 'Diária', valid: !validationErrors.pricePerNight },
    { key: 'maxGuests', label: 'Capacidade', valid: !validationErrors.maxGuests },
    { key: 'coverImage', label: 'Fotos', valid: !validationErrors.coverImage },
  ];
  const validCount = requiredFields.filter((f) => f.valid).length;
  const totalCount = requiredFields.length;
  const healthPercentage = Math.round((validCount / totalCount) * 100);

  // Lock body scroll and listen for ESC key
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel]);

  // Image Resizing and Optimization using HTML5 Canvas
  const resizeAndOptimizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          const maxWidth = 750;
          const maxHeight = 550;
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(readerEvent.target?.result as string);
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'medium';
          ctx.drawImage(img, 0, 0, width, height);

          // Output lightweight web-ready JPEG to prevent localStorage quota exhaustion
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.55);
          resolve(optimizedDataUrl);
        };
        img.onerror = () => {
          resolve(readerEvent.target?.result as string);
        };
        img.src = readerEvent.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const processUploadedFiles = async (filesList: FileList | File[]) => {
    const validFiles = Array.from(filesList).filter((f) => f.type.startsWith('image/'));
    if (validFiles.length === 0) return;

    setIsProcessingImages(true);
    setProcessingProgress(`Otimizando 1 de ${validFiles.length}...`);

    const newOptimizedImages: string[] = [];
    for (let i = 0; i < validFiles.length; i++) {
      setProcessingProgress(`Otimizando foto ${i + 1} de ${validFiles.length}...`);
      try {
        const optimized = await resizeAndOptimizeImage(validFiles[i]);
        newOptimizedImages.push(optimized);
      } catch (err) {
        console.error('Erro ao processar imagem:', err);
      }
    }

    if (newOptimizedImages.length > 0) {
      setImages((prev) => {
        const updated = [...prev, ...newOptimizedImages];
        return updated;
      });
      if (!coverImage) {
        setCoverImage(newOptimizedImages[0]);
      }
    }

    setIsProcessingImages(false);
    setProcessingProgress('');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processUploadedFiles(e.dataTransfer.files);
    }
  };

  const handleManualFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processUploadedFiles(e.target.files);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleToggleCategory = (cat: PropertyCategory) => {
    if (categories.includes(cat)) {
      if (categories.length > 1) {
        setCategories(categories.filter((c) => c !== cat));
      }
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleToggleAmenity = (amenity: string) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter((a) => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handleAddCustomAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCustomAmenity.trim() && !amenities.includes(newCustomAmenity.trim())) {
      setAmenities([...amenities, newCustomAmenity.trim()]);
      setNewCustomAmenity('');
    }
  };

  const handleAddImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (newImageUrl.trim()) {
      const url = newImageUrl.trim();
      setImages([...images, url]);
      if (!coverImage) {
        setCoverImage(url);
      }
      setNewImageUrl('');
    }
  };

  const handleSetPrimaryImage = (imgUrl: string) => {
    setCoverImage(imgUrl);
    const filtered = images.filter((img) => img !== imgUrl);
    setImages([imgUrl, ...filtered]);
    onToast('Foto definida como capa principal!', 'info');
  };

  const handleRemoveImage = (imgUrl: string) => {
    const filtered = images.filter((img) => img !== imgUrl);
    setImages(filtered);
    if (coverImage === imgUrl && filtered.length > 0) {
      setCoverImage(filtered[0]);
    }
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRuleText.trim()) {
      setHouseRules([...houseRules, newRuleText.trim()]);
      setNewRuleText('');
    }
  };

  const handleRemoveRule = (index: number) => {
    setHouseRules(houseRules.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all required fields as touched to trigger any errors
    setTouched({
      name: true,
      location: true,
      pricePerNight: true,
      maxGuests: true,
      coverImage: true,
    });

    if (!isValid) {
      onToast('Por favor, verifique os campos destacados em vermelho antes de salvar.', 'error');
      return;
    }

    const payload: Partial<Property> & { name: string; location: string } = {
      ...(property || {}),
      name: name.trim(),
      tagline: tagline.trim() || name.trim(),
      description: description.trim() || tagline.trim(),
      longDescription: longDescriptionText
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean),
      location: location.trim(),
      neighborhood: neighborhood.trim() || location.trim(),
      address: address.trim(),
      city: city.trim() || 'Palmas',
      state: state.trim() || 'TO',
      status,
      category: categories,
      pricePerNight: Number(pricePerNight) || 450,
      cleaningFee: Number(cleaningFee) || 0,
      maxGuests: Number(maxGuests) || 4,
      bedrooms: Number(bedrooms) || 1,
      beds: Number(beds) || 1,
      bathrooms: Number(bathrooms) || 1,
      coverImage: coverImage || images[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      images: images.length > 0 ? images : [coverImage],
      amenities,
      badge: badge.trim() || 'Destaque',
      isSuperhost,
      checkInTime,
      checkOutTime,
      houseRules,
      coordinates: {
        lat: Number(coordinates.lat) || -10.1837,
        lng: Number(coordinates.lng) || -48.3582,
      },
    };

    onSave(payload);
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onCancel();
          }
        }}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-[#F8F9FA] w-full max-w-6xl max-h-[92vh] rounded-3xl shadow-2xl border border-[#DEE2E6] flex flex-col overflow-hidden my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="bg-white border-b border-[#DEE2E6] px-5 sm:px-8 py-4 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-[#FAF7F2] border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center font-bold shadow-2xs shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">
                    {isEditing ? 'Edição de Imóvel' : 'Novo Cadastro'}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
                  <span className="text-[10px] font-semibold text-neutral-500 hidden sm:inline">
                    {status === 'active' ? 'Publicado no site' : 'Rascunho / Oculto'}
                  </span>
                </div>
                <h2 className="font-serif text-lg sm:text-2xl font-bold text-neutral-900 truncate">
                  {isEditing ? property.name : 'Cadastrar Acomodação em Palmas'}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Publication Status Toggle */}
              <button
                type="button"
                onClick={() => setStatus(status === 'active' ? 'inactive' : 'active')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                  status === 'active'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-neutral-100 text-neutral-600 border-neutral-200 hover:bg-neutral-200'
                }`}
                title="Clique para alternar o status de visibilidade no site"
              >
                {status === 'active' ? (
                  <>
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">Ativo no Site</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-neutral-500" />
                    <span className="hidden sm:inline">Rascunho</span>
                  </>
                )}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onCancel}
                className="w-10 h-10 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 flex items-center justify-center transition-colors cursor-pointer"
                title="Fechar formulário (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Real-time Health & Validation Status Bar */}
          <div className="bg-[#FAF9F7] px-5 sm:px-8 py-2.5 border-b border-[#DEE2E6] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Validação em Tempo Real:</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {requiredFields.map((f) => (
                  <span
                    key={f.key}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border transition-colors ${
                      f.valid
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                    }`}
                  >
                    {f.valid ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    <span>{f.label}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="w-24 bg-neutral-200 h-2 rounded-full overflow-hidden shrink-0">
                <div 
                  className={`h-full transition-all duration-300 ${healthPercentage === 100 ? 'bg-emerald-500' : 'bg-[#C5A059]'}`}
                  style={{ width: `${healthPercentage}%` }}
                />
              </div>
              <span className="font-bold text-neutral-700 whitespace-nowrap text-[11px]">
                {healthPercentage}% Completo
              </span>
            </div>
          </div>

          {/* Form Body: Responsive 2-Column Grid on Desktop, 1-Column on Mobile */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* ========================================================= */}
              {/* COLUNA 1 / SEÇÃO: DADOS GERAIS & LOCALIZAÇÃO */}
              {/* ========================================================= */}
              <div className="space-y-6">
                
                {/* 1. SEÇÃO: DADOS GERAIS */}
                <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#DEE2E6] shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <h3 className="font-serif font-bold text-base sm:text-lg text-neutral-900">
                        1. Dados Gerais & Apresentação
                      </h3>
                    </div>
                    {!validationErrors.name ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Válido</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Obrigatório</span>
                      </span>
                    )}
                  </div>

                  {/* Nome do Imóvel (Required) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5 flex items-center justify-between">
                      <span>Título do Imóvel *</span>
                      {name && !validationErrors.name && (
                        <span className="text-emerald-600 text-[11px] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Título válido
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onBlur={() => markTouched('name')}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Mansão Vista Lago Orla 14"
                      className={`w-full px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        touched.name && validationErrors.name
                          ? 'bg-rose-50/40 border-rose-300 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                          : name.length >= 4
                          ? 'bg-white border-emerald-300 text-neutral-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:bg-white focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20'
                      }`}
                    />
                    {touched.name && validationErrors.name && (
                      <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {validationErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Tagline / Frase de Destaque */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Subtítulo Comercial / Tagline
                    </label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="Ex: Luxo contemporâneo com acesso direto ao Lago de Palmas"
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 bg-neutral-50 focus:bg-white focus:outline-hidden focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20"
                    />
                  </div>

                  {/* Categorias / Tipo de Imóvel */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Categorias & Coleções
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_CATEGORIES.map((cat) => {
                        const isSelected = categories.includes(cat.id);
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleToggleCategory(cat.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-[#002147] text-white shadow-2xs'
                                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200/60'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-[#C5A059]" />}
                            <span>{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Badge & Superhost */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                        Selo / Badge do Card
                      </label>
                      <input
                        type="text"
                        value={badge}
                        onChange={(e) => setBadge(e.target.value)}
                        placeholder="Ex: Destaque, Vista Lago, Exclusivo"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 bg-neutral-50 focus:bg-white focus:outline-hidden focus:border-[#C5A059]"
                      />
                    </div>

                    <div className="flex flex-col justify-end">
                      <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 cursor-pointer hover:bg-neutral-100/70 transition-colors">
                        <input
                          type="checkbox"
                          checked={isSuperhost}
                          onChange={(e) => setIsSuperhost(e.target.checked)}
                          className="w-4 h-4 rounded-md text-[#C5A059] focus:ring-[#C5A059] border-neutral-300"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-neutral-900 block flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>Imóvel Superhost</span>
                          </span>
                          <span className="text-[10px] text-neutral-500">Selo de excelência operacional</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Descrição Detalhada */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Descrição Completa da Propriedade
                    </label>
                    <textarea
                      rows={3}
                      value={longDescriptionText}
                      onChange={(e) => setLongDescriptionText(e.target.value)}
                      placeholder="Descreva a arquitetura, vista, conforto térmico e comodidades..."
                      className="w-full p-3.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 bg-neutral-50 focus:bg-white focus:outline-hidden focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20"
                    />
                  </div>
                </div>

                {/* 2. SEÇÃO: LOCALIZAÇÃO */}
                <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#DEE2E6] shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                      </div>
                      <h3 className="font-serif font-bold text-base sm:text-lg text-neutral-900">
                        2. Localização em Palmas, TO
                      </h3>
                    </div>
                    {!validationErrors.location ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Válido</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Obrigatório</span>
                      </span>
                    )}
                  </div>

                  {/* Bairro / Região (Required) */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5 flex items-center justify-between">
                      <span>Bairro ou Região de Referência *</span>
                      {location && !validationErrors.location && (
                        <span className="text-emerald-600 text-[11px] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Bairro válido
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      required
                      value={location}
                      onBlur={() => markTouched('location')}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        if (!neighborhood) setNeighborhood(e.target.value);
                      }}
                      placeholder="Ex: Orla 14 - Graciosa, Palmas, TO"
                      className={`w-full px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                        touched.location && validationErrors.location
                          ? 'bg-rose-50/40 border-rose-300 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                          : location.length >= 3
                          ? 'bg-white border-emerald-300 text-neutral-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-900 focus:bg-white focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20'
                      }`}
                    />
                    {touched.location && validationErrors.location && (
                      <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {validationErrors.location}
                      </p>
                    )}
                  </div>

                  {/* Endereço Completo */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                      Endereço Completo / Condomínio
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Ex: Alameda dos Buritis, Lote 04, Condomínio Mirante do Lago"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 bg-neutral-50 focus:bg-white focus:outline-hidden focus:border-[#C5A059]"
                    />
                  </div>

                  {/* Cidade e Estado */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                        Cidade
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Palmas"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 bg-neutral-50 focus:bg-white focus:outline-hidden focus:border-[#C5A059]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                        Estado
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="TO"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 bg-neutral-50 focus:bg-white focus:outline-hidden focus:border-[#C5A059]"
                      />
                    </div>
                  </div>

                  {/* Localização GPS & Google Maps (Tempo Real) */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-[#FBF7EF] to-white border border-[#C5A059]/30 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#C5A059]">
                        <Compass className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                          Google Maps & Localização em Tempo Real
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isManualCoords ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {isManualCoords ? 'Coordenadas Manuais' : 'Auto-detectado'}
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-600 leading-relaxed">
                      O mapa e o botão de rota no site direcionam o hóspede <strong>exatamente para este local</strong> no Google Maps. Escolha uma região rápida abaixo ou ajuste as coordenadas:
                    </p>

                    {/* Quick Region Chips */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1.5">
                        Regiões e Pontos Rápidos de Palmas:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {PALMAS_REGIONS.map((reg) => {
                          const isSelected = Math.abs(coordinates.lat - reg.coordinates.lat) < 0.001 && Math.abs(coordinates.lng - reg.coordinates.lng) < 0.001;
                          return (
                            <button
                              key={reg.id}
                              type="button"
                              onClick={() => {
                                setCoordinates(reg.coordinates);
                                setIsManualCoords(true);
                                if (!location) setLocation(reg.name);
                              }}
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                                isSelected
                                  ? 'bg-[#00152B] text-white border-[#00152B] shadow-xs'
                                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-[#C5A059] hover:bg-[#FBF7EF]'
                              }`}
                            >
                              <MapPin className="w-2.5 h-2.5 text-[#C5A059]" />
                              {reg.shortLabel}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Coordinates Inputs */}
                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                          Latitude (GPS)
                        </label>
                        <input
                          type="number"
                          step="0.000001"
                          value={coordinates.lat}
                          onChange={(e) => {
                            setCoordinates((prev) => ({ ...prev, lat: parseFloat(e.target.value) || 0 }));
                            setIsManualCoords(true);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs text-neutral-900 bg-white font-mono focus:border-[#C5A059] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                          Longitude (GPS)
                        </label>
                        <input
                          type="number"
                          step="0.000001"
                          value={coordinates.lng}
                          onChange={(e) => {
                            setCoordinates((prev) => ({ ...prev, lng: parseFloat(e.target.value) || 0 }));
                            setIsManualCoords(true);
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs text-neutral-900 bg-white font-mono focus:border-[#C5A059] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    {/* Map Preview & Direct Testing Buttons */}
                    <div className="space-y-2 pt-1">
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
                        <iframe
                          title="Prévia do Mapa"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          src={getGoogleMapsEmbedUrl(coordinates.lat, coordinates.lng)}
                        />
                        <div className="absolute top-1.5 left-1.5 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] font-bold text-neutral-800 shadow-xs">
                          Prévia do Pin
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={getGoogleMapsSearchUrl(coordinates.lat, coordinates.lng, name || location)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-1.5 px-2.5 rounded-lg bg-white border border-[#C5A059]/40 text-[#C5A059] hover:bg-[#FBF7EF] text-[11px] font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                        >
                          <Navigation className="w-3 h-3" />
                          Testar no Google Maps
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            const resolved = resolvePalmasCoordinates(`${name} ${location} ${neighborhood} ${address}`);
                            setCoordinates(resolved);
                            setIsManualCoords(false);
                            onToast('Coordenadas recalculadas com base no nome e endereço.', 'info');
                          }}
                          className="py-1.5 px-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-semibold transition-colors"
                        >
                          Redetectar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* ========================================================= */}
              {/* COLUNA 2 / SEÇÃO: PREÇO, FOTOS, COMODIDADES */}
              {/* ========================================================= */}
              <div className="space-y-6">

                {/* 3. SEÇÃO: PREÇO E CAPACIDADE */}
                <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#DEE2E6] shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-[#C5A059]" />
                      </div>
                      <h3 className="font-serif font-bold text-base sm:text-lg text-neutral-900">
                        3. Preço & Capacidade
                      </h3>
                    </div>
                    {!validationErrors.pricePerNight && !validationErrors.maxGuests ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Válido</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Verificar</span>
                      </span>
                    )}
                  </div>

                  {/* Diária & Taxa de Limpeza */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5 flex items-center justify-between">
                        <span>Diária Base (R$) *</span>
                        {Number(pricePerNight) > 0 && (
                          <span className="text-emerald-600 text-[10px] font-bold">✓ OK</span>
                        )}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500">
                          R$
                        </span>
                        <input
                          type="number"
                          step="any"
                          value={pricePerNight}
                          onBlur={() => markTouched('pricePerNight')}
                          onChange={(e) => setPricePerNight(e.target.value)}
                          placeholder="Ex: 450 ou valor livre"
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-neutral-50 border border-neutral-200 text-neutral-900 focus:bg-white focus:border-[#C5A059]"
                        />
                      </div>
                      {touched.pricePerNight && validationErrors.pricePerNight && (
                        <p className="text-[11px] text-rose-600 mt-1 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {validationErrors.pricePerNight}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                        Taxa de Limpeza (R$)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500">
                          R$
                        </span>
                        <input
                          type="number"
                          step="any"
                          value={cleaningFee}
                          onChange={(e) => setCleaningFee(e.target.value)}
                          placeholder="Ex: 150 ou valor livre"
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm font-bold text-neutral-900 bg-neutral-50 focus:bg-white focus:border-[#C5A059]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Capacidade, Quartos, Camas, Banheiros */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Hóspedes
                      </label>
                      <div className="relative">
                        <Users className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="number"
                          step="any"
                          value={maxGuests}
                          onChange={(e) => setMaxGuests(e.target.value)}
                          placeholder="Livre"
                          className="w-full pl-8 pr-2.5 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-900 bg-neutral-50 focus:bg-white focus:border-[#C5A059]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Quartos
                      </label>
                      <div className="relative">
                        <Bed className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="number"
                          step="any"
                          value={bedrooms}
                          onChange={(e) => setBedrooms(e.target.value)}
                          placeholder="Livre"
                          className="w-full pl-8 pr-2.5 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-900 bg-neutral-50 focus:bg-white focus:border-[#C5A059]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Camas
                      </label>
                      <div className="relative">
                        <Bed className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="number"
                          step="any"
                          value={beds}
                          onChange={(e) => setBeds(e.target.value)}
                          placeholder="Livre"
                          className="w-full pl-8 pr-2.5 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-900 bg-neutral-50 focus:bg-white focus:border-[#C5A059]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Banheiros
                      </label>
                      <div className="relative">
                        <Bath className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                          type="number"
                          step="any"
                          value={bathrooms}
                          onChange={(e) => setBathrooms(e.target.value)}
                          placeholder="Livre"
                          className="w-full pl-8 pr-2.5 py-2 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-900 bg-neutral-50 focus:bg-white focus:border-[#C5A059]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Check-in e Check-out */}
                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-neutral-100">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Check-in a partir de:
                      </label>
                      <input
                        type="time"
                        value={checkInTime}
                        onChange={(e) => setCheckInTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-900 bg-neutral-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Check-out até:
                      </label>
                      <input
                        type="time"
                        value={checkOutTime}
                        onChange={(e) => setCheckOutTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-900 bg-neutral-50 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. SEÇÃO: FOTOS E MÍDIA */}
                <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#DEE2E6] shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-[#C5A059]" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-base sm:text-lg text-neutral-900">
                          4. Galeria de Fotos ({images.length})
                        </h3>
                      </div>
                    </div>
                    {images.length > 0 ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{images.length} {images.length === 1 ? 'foto' : 'fotos'}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Foto requerida</span>
                      </span>
                    )}
                  </div>

                  {/* Drag & Drop Upload Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                      isDragging
                        ? 'border-[#C5A059] bg-[#FAF7F2] scale-[1.01]'
                        : 'border-neutral-200 hover:border-[#C5A059] hover:bg-[#FAF9F7]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center">
                      {isProcessingImages ? (
                        <Loader2 className="w-5 h-5 animate-spin text-[#C5A059]" />
                      ) : (
                        <Upload className="w-5 h-5 text-[#C5A059]" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-neutral-800">
                        {isProcessingImages ? processingProgress : 'Arraste fotos aqui ou clique para selecionar'}
                      </p>
                      <p className="text-[11px] text-neutral-400">
                        Otimização automática para carregamento ultrarrápido (JPG, PNG, WebP)
                      </p>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleManualFileInput}
                      className="hidden"
                    />
                  </div>

                  {/* Add via URL Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Ou cole a URL direta de uma imagem na web..."
                      className="flex-1 px-3.5 py-2 rounded-xl border border-neutral-200 text-xs text-neutral-900 bg-neutral-50 focus:bg-white focus:outline-hidden focus:border-[#C5A059]"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="bg-neutral-900 hover:bg-[#002147] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 min-h-[38px]"
                    >
                      + Adicionar URL
                    </button>
                  </div>

                  {/* Thumbnails Grid with 1-Click Set Cover */}
                  {images.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
                      {images.map((imgUrl, idx) => {
                        const isCover = coverImage === imgUrl;

                        return (
                          <div
                            key={idx}
                            className={`relative rounded-xl overflow-hidden aspect-4/3 border group transition-all ${
                              isCover ? 'ring-2 ring-[#C5A059] border-[#C5A059]' : 'border-neutral-200'
                            }`}
                          >
                            <img
                              src={imgUrl}
                              alt={`Foto ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />

                            {/* Cover Badge */}
                            {isCover && (
                              <div className="absolute top-1 left-1 bg-[#C5A059] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-1 z-10">
                                <Star className="w-2.5 h-2.5 fill-white" />
                                <span>Capa</span>
                              </div>
                            )}

                            {/* Hover Actions */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                              {!isCover && (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryImage(imgUrl)}
                                  className="p-1.5 rounded-lg bg-[#C5A059] text-white hover:scale-105 transition-transform cursor-pointer"
                                  title="Definir como foto de capa principal"
                                >
                                  <Star className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(imgUrl)}
                                className="p-1.5 rounded-lg bg-rose-600 text-white hover:scale-105 transition-transform cursor-pointer"
                                title="Remover esta foto"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-center text-xs text-rose-700 font-medium">
                      Nenhuma foto adicionada ainda. Adicione pelo menos 1 foto para o anúncio.
                    </div>
                  )}
                </div>

                {/* 5. SEÇÃO: COMODIDADES & REGRAS */}
                <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#DEE2E6] shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-[#C5A059]" />
                      </div>
                      <h3 className="font-serif font-bold text-base sm:text-lg text-neutral-900">
                        5. Comodidades & Regras ({amenities.length})
                      </h3>
                    </div>
                  </div>

                  {/* Amenity Badges Multi-Select */}
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                    {PRESET_AMENITIES.map((amenity) => {
                      const isChecked = amenities.includes(amenity);
                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => handleToggleAmenity(amenity)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isChecked
                              ? 'bg-[#C5A059]/15 text-[#8C6D23] border border-[#C5A059]/40'
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border border-transparent'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 text-[#C5A059]" />}
                          <span>{amenity}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Add Custom Amenity */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={newCustomAmenity}
                      onChange={(e) => setNewCustomAmenity(e.target.value)}
                      placeholder="Outra comodidade personalizada..."
                      className="flex-1 px-3 py-1.5 rounded-xl border border-neutral-200 text-xs text-neutral-900 bg-neutral-50 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomAmenity}
                      className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      + Incluir
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#DEE2E6] shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3.5 z-20">
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-600">
                {isValid ? (
                  <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold">Todos os requisitos preenchidos! Pronto para salvar.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{Object.keys(validationErrors).length} {Object.keys(validationErrors).length === 1 ? 'campo obrigatório pendente' : 'campos obrigatórios pendentes'}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 sm:flex-none px-5 py-3 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-100 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer min-h-[44px]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-none bg-[#002147] hover:bg-[#C5A059] text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer min-h-[44px] active:scale-[0.98]"
                >
                  <Check className="w-4 h-4" />
                  <span>{isEditing ? 'Salvar Alterações' : 'Publicar Imóvel'}</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
