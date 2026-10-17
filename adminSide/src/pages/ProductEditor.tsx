import { useState, useEffect } from 'react';
import AdminImageUploader from '../components/admin/AdminImageUploader';
import { cachedFetch, invalidateCache } from '../lib/apiCache';
import {
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Layers,
  Coins,
  Settings,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  ExternalLink,
  FileText,
  Plus,
  Trash2,
  Sparkles,
  Gem,
  Package,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Copy
} from 'lucide-react';
import { cn } from '../lib/utils';

// Metadata Constants mapped to IDs
const METAL_TYPES = [
  { id: '1', name: 'White Gold' },
  { id: '2', name: 'Yellow Gold' },
  { id: '3', name: 'Rose Gold' },
  { id: '4', name: 'Platinum' },
  { id: '5', name: 'Silver' }
];

const KARATS = [
  { id: '1', name: '18K' },
  { id: '2', name: '22K' },
  { id: '3', name: '14K' },
  { id: '4', name: '9K' }
];

const DIAMOND_QUALITIES = [
  { id: '1', name: 'IJ-SI', rateKey: 'diamond_rate_ij_si' },
  { id: '2', name: 'GH-VS', rateKey: 'diamond_rate_gh_vs' },
  { id: '3', name: 'EF-VVS', rateKey: 'diamond_rate_ef_vvs' },
  { id: '4', name: 'FG-SI', rateKey: 'diamond_rate_fg_si' }
];

const SOLITAIRE_QUALITIES = [
  { id: '1', name: 'IJ-SI', key: 'solitaire_price_ij_si' },
  { id: '2', name: 'GH-VS', key: 'solitaire_price_gh_vs' },
  { id: '3', name: 'EF-VVS', key: 'solitaire_price_ef_vvs' },
  { id: '4', name: 'FG-SI', key: 'solitaire_price_fg_si' }
];

const GENDERS = [
  { id: '1', name: 'Male' },
  { id: '2', name: 'Female' },
  { id: '3', name: 'Unisex' },
  { id: '4', name: 'Kids' }
];

export const CATEGORIES = [
  { id: '1', name: 'Rings' },
  { id: '2', name: 'Pendants' },
  { id: '3', name: 'Nose Pins' },
  { id: '4', name: 'Bangles' },
  { id: '5', name: 'Chains' },
  { id: '6', name: 'Earrings' },
  { id: '7', name: 'Mangalsutra' },
  { id: '8', name: 'Tennis Bracelets' },
  { id: '9', name: 'Bracelets' },
  { id: '10', name: 'Necklaces' },
  { id: '11', name: 'Jewellery Set' }
];

export interface SetItemPriceBreakup {
  gold_cost: number;
  diamond_cost: number;
  solitaire_cost: number;
  gemstone_cost: number;
  color_stone_cost: number;
  making_charges: number;
  gst: number;
  subtotal: number;
  total: number;
  net_gold_weight: number;
}

export interface SetItemData {
  id: string;
  name: string;
  item_type: string;
  product_weight: number;
  gold_weight: number;
  karat: string;
  metal_type?: string;
  height?: number;
  width?: number;
  size?: string;
  includeMetal: boolean;
  includeDiamond: boolean;
  diamond_weight: number;
  diamond_count: number;
  diamond_quality: string;
  diamond_rate?: number;
  diamond_setting?: string;
  includeSolitaire: boolean;
  solitaire_weight: number;
  solitaire_quality: string;
  solitaire_price: number;
  solitaire_setting?: string;
  includeGemstone: boolean;
  gemstone_info?: string;
  gemstone_weight: number;
  gemstone_price: number;
  noof_gem: number;
  includeColorStone: boolean;
  color_stone?: string;
  color_stone_weight: number;
  color_stone_count: number;
  color_stone_price: number;
  making_charges: number;
  calculated_price: number;
  price_breakup?: SetItemPriceBreakup;
}

export const PREDEFINED_SET_ITEMS = [
  { id: 'necklace', name: 'Necklace', icon: '📿' },
  { id: 'earrings', name: 'Earrings', icon: '✨' },
  { id: 'nosepin', name: 'Nose Pin', icon: '💎' },
  { id: 'ring', name: 'Ring', icon: '💍' },
  { id: 'bracelet', name: 'Bracelet', icon: '💫' },
  { id: 'bangle', name: 'Bangle', icon: '🟡' },
  { id: 'maang_tikka', name: 'Maang Tikka', icon: '👑' },
  { id: 'mangalsutra', name: 'Mangalsutra', icon: '🪢' },
  { id: 'pendant', name: 'Pendant', icon: '🪙' }
];

export const calculateSetItemPrice = (
  item: Partial<SetItemData>,
  rates: any,
  defaultMakingPercent: number = 15
): SetItemPriceBreakup => {
  const gst_percent = rates?.gst_percent ?? 3;
  const gold_rate_24k = rates?.gold_rate_24k || 7500;

  const karatStr = String(item.karat || '14K').toUpperCase();
  let goldRate = rates?.gold_rate_14k || Math.floor(gold_rate_24k * 0.585);
  if (karatStr.includes('24')) {
    goldRate = gold_rate_24k;
  } else if (karatStr.includes('22')) {
    goldRate = Math.floor(gold_rate_24k * 0.916);
  } else if (karatStr.includes('18')) {
    goldRate = Math.floor(gold_rate_24k * 0.75);
  } else if (karatStr.includes('14')) {
    goldRate = rates?.gold_rate_14k || Math.floor(gold_rate_24k * 0.585);
  } else if (karatStr.includes('9')) {
    goldRate = Math.floor(gold_rate_24k * 0.37);
  }

  const grossWeight = Number(item.product_weight || item.gold_weight || 0);
  const diamondWeight = item.includeDiamond !== false ? Number(item.diamond_weight || 0) : 0;
  const solitaireWeight = item.includeSolitaire ? Number(item.solitaire_weight || 0) : 0;
  const gemstoneWeight = item.includeGemstone ? Number(item.gemstone_weight || 0) : 0;
  const colorStoneWeight = item.includeColorStone ? Number(item.color_stone_weight || 0) : 0;

  const netGoldWeight = Math.max(0, grossWeight - (diamondWeight * 0.2) - (solitaireWeight * 0.2) - (gemstoneWeight * 0.2) - (colorStoneWeight * 0.2));
  const goldCost = item.includeMetal !== false ? Math.floor(netGoldWeight * goldRate) : 0;

  let diamondRate = Number(item.diamond_rate || 0);
  if (!diamondRate) {
    const dq = String(item.diamond_quality || 'IJ-SI').toUpperCase();
    if (dq === 'GH-VS' || dq === '2') diamondRate = rates?.diamond_rate_gh_vs || 95000;
    else if (dq === 'EF-VVS' || dq === '3') diamondRate = rates?.diamond_rate_ef_vvs || 110000;
    else if (dq === 'FG-SI' || dq === '4') diamondRate = rates?.diamond_rate_fg_si || 88000;
    else diamondRate = rates?.diamond_rate_ij_si || rates?.diamond_rate || 80000;
  }
  const diamondCost = item.includeDiamond !== false ? Math.round(diamondWeight * diamondRate) : 0;
  const solitaireCost = item.includeSolitaire ? Number(item.solitaire_price || 0) : 0;
  const gemstoneCost = item.includeGemstone ? Number(item.gemstone_price || 0) : 0;
  const colorStoneCost = item.includeColorStone ? Number(item.color_stone_price || 0) : 0;

  const mcPercent = item.making_charges !== undefined && item.making_charges !== null && !isNaN(Number(item.making_charges))
    ? Number(item.making_charges)
    : defaultMakingPercent;
  const goldCost24k = netGoldWeight * gold_rate_24k;
  const makingCharges = Math.round(goldCost24k * mcPercent / 100);

  const subtotal = goldCost + diamondCost + solitaireCost + gemstoneCost + colorStoneCost + makingCharges;
  const gst = Math.round(subtotal * (gst_percent / 100));
  const total = subtotal + gst;

  return {
    gold_cost: goldCost,
    diamond_cost: diamondCost,
    solitaire_cost: solitaireCost,
    gemstone_cost: gemstoneCost,
    color_stone_cost: colorStoneCost,
    making_charges: makingCharges,
    gst,
    subtotal,
    total,
    net_gold_weight: Number(netGoldWeight.toFixed(3))
  };
};

export const SUBCATEGORIES = [
  { id: '1', name: 'Engagement Rings' },
  { id: '2', name: 'Solitaire Rings' },
  { id: '3', name: 'Casual Rings' },
  { id: '4', name: 'Cocktail Rings' },
  { id: '5', name: 'Band Rings' },
  { id: '6', name: 'Stud Earrings' },
  { id: '7', name: 'Hoop Earrings' },
  { id: '8', name: 'Drop Earrings' },
  { id: '9', name: 'Diamond' },
  { id: '10', name: 'colour stone ring' }
];

const RING_SIZES = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
const BANGLE_SIZES = [
  '2.0', '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8', '2.9', '2.10', '2.11', '2.12', '2.13', '2.14', '2.15',
  '3.0', '3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9', '3.10', '3.11', '3.12', '3.13', '3.14', '3.15',
  '4.0'
];
const CHAIN_SIZES_AANA = ['256', '288', '320', '352', '384', '416', '448'];
const MANGALSUTRA_SIZES_AANA = ['224', '256', '288', '320', '352', '384'];
const TENNIS_BRACELET_SIZES_AANA = ['256', '288', '320', '352', '384'];

interface ProductEditorProps {
  productId?: string;
  onBack?: () => void;
  onSaveSuccess?: (savedProduct: any) => void;
}

interface ProductFormData {
  _id?: string;
  product_id: string;
  category_id: string;
  subcategory_id: string;
  product_title: string;
  product_code: string;
  hsn_code: string;
  product_type: string;
  product_slug: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  gender: string;
  size_id: string;
  banglesize_id: string;
  karat_id: string;
  metal_type: string;
  gallery: Record<string, string[]>;
  height: number;
  diamond_quality: string;
  diamond_rate_ij_si?: number;
  diamond_rate_gh_vs?: number;
  diamond_rate_ef_vvs?: number;
  diamond_rate_fg_si?: number;
  custom_diamond_rates?: Record<string, number>;
  width: number;
  gold_weight: number;
  diamond_weight: number;
  diamond_count: number;
  solitaires_weight: number;
  solitaire_weight?: number;
  solitaires_price: number;
  solitaires_quality: string;
  solitaire_price_ij_si?: number;
  solitaire_price_gh_vs?: number;
  solitaire_price_ef_vvs?: number;
  solitaire_price_fg_si?: number;
  custom_solitaire_prices?: Record<string, number>;
  solitaire_setting?: string;
  solitaires_setting?: string;
  product_weight: number;
  center_diamond_weight: number | null;
  center_diamond_price: number | null;
  custom_type: string;
  color_stone: string | null;
  color_stone_weight?: number;
  color_stone_count?: number;
  color_stone_price?: number;
  gemstone_info?: string | null;
  gemstone_weight: number;
  gemstone_price: number;
  noof_gem: number;
  status: string;
  feature: string;
  topselling: string;
  sessional: string;
  meta_title: string;
  meta_keyword: string;
  meta_description: string;
  making_charges: number;
  makingCharges: number;
  is_set?: boolean;
  set_items?: SetItemData[];
}

export default function ProductEditor({ productId, onBack, onSaveSuccess }: ProductEditorProps) {
  // Parse ID from prop or location query params
  const getProductId = () => {
    if (productId) return productId;
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('id') || 'new';
  };

  const currentId = getProductId();
  const isNew = currentId === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [includeMetal, setIncludeMetal] = useState(true);
  const [includeSolitaire, setIncludeSolitaire] = useState(false);
  const [includeDiamond, setIncludeDiamond] = useState(false);
  const [includeGemstone, setIncludeGemstone] = useState(false);
  const [includeColorStone, setIncludeColorStone] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  // Manual custom solitaire purity input states
  const [customPurityInput, setCustomPurityInput] = useState('');
  const [customPurityPriceInput, setCustomPurityPriceInput] = useState('');

  // Form State matching productModel.js fields
  const [formData, setFormData] = useState<ProductFormData>({
    product_id: '',
    category_id: '',
    subcategory_id: '',
    product_title: '',
    product_code: '',
    hsn_code: '00',
    product_type: 'diamond',
    product_slug: '',
    description: '',
    price: 0,
    discount: 0,
    stock: 0,
    gender: '2',
    size_id: '',
    banglesize_id: '2.6',
    karat_id: '',
    metal_type: '',
    gallery: {},
    height: 0,
    diamond_quality: '',
    diamond_rate_ij_si: 0,
    diamond_rate_gh_vs: 0,
    diamond_rate_ef_vvs: 0,
    diamond_rate_fg_si: 0,
    custom_diamond_rates: {},
    width: 0,
    gold_weight: 0,
    diamond_weight: 0,
    diamond_count: 0,
    solitaires_weight: 0,
    solitaire_weight: 0,
    solitaires_price: 0,
    solitaires_quality: '0',
    solitaire_price_ij_si: 0,
    solitaire_price_gh_vs: 0,
    solitaire_price_ef_vvs: 0,
    solitaire_price_fg_si: 0,
    custom_solitaire_prices: {},
    solitaire_setting: 'Prong Setting',
    solitaires_setting: 'Prong Setting',
    product_weight: 0,
    center_diamond_weight: null,
    center_diamond_price: null,
    custom_type: '0',
    color_stone: null,
    color_stone_weight: 0,
    color_stone_count: 0,
    color_stone_price: 0,
    gemstone_info: null,
    gemstone_weight: 0,
    gemstone_price: 0,
    noof_gem: 0,
    status: '1',
    feature: '0',
    topselling: '0',
    sessional: '0',
    meta_title: '',
    meta_keyword: '',
    meta_description: '',
    making_charges: 0,
    makingCharges: 0,
    is_set: false,
    set_items: []
  });

  const sanitizeIncomingProduct = (product: any) => {
    let parsedGallery = {};
    if (product.gallery) {
      if (typeof product.gallery === 'string') {
        try {
          parsedGallery = JSON.parse(product.gallery);
        } catch (e) {
          console.error('Failed to parse gallery JSON string', e);
        }
      } else if (typeof product.gallery === 'object') {
        parsedGallery = product.gallery;
      }
    }

    let parsedCustomSolPrices: Record<string, number> = {};
    if (product.custom_solitaire_prices) {
      if (typeof product.custom_solitaire_prices === 'string') {
        try {
          parsedCustomSolPrices = JSON.parse(product.custom_solitaire_prices);
        } catch (e) {
          console.error('Failed to parse custom_solitaire_prices JSON string', e);
        }
      } else if (typeof product.custom_solitaire_prices === 'object') {
        parsedCustomSolPrices = product.custom_solitaire_prices;
      }
    }

    let parsedCustomDiamondRates: Record<string, number> = {};
    if (product.custom_diamond_rates) {
      if (typeof product.custom_diamond_rates === 'string') {
        try {
          parsedCustomDiamondRates = JSON.parse(product.custom_diamond_rates);
        } catch (e) {
          console.error('Failed to parse custom_diamond_rates JSON string', e);
        }
      } else if (typeof product.custom_diamond_rates === 'object') {
        parsedCustomDiamondRates = product.custom_diamond_rates;
      }
    }

    let parsedSetItems: SetItemData[] = [];
    if (product.set_items) {
      if (typeof product.set_items === 'string') {
        try {
          parsedSetItems = JSON.parse(product.set_items);
        } catch (e) {
          console.error('Failed to parse set_items JSON string', e);
        }
      } else if (Array.isArray(product.set_items)) {
        parsedSetItems = product.set_items;
      }
    }

    // Map metal names back to IDs
    const rawMetalType = product.metal_type || '';
    const resolvedMetalType = rawMetalType
      .split(',')
      .map((s: string) => s.trim())
      .map((s: string) => {
        const found = METAL_TYPES.find(m => m.name.toLowerCase() === s.toLowerCase() || m.id === s);
        return found ? found.id : s;
      })
      .filter(Boolean)
      .join(',');

    // Map gender names back to IDs
    const rawGender = product.gender || '';
    const foundGender = GENDERS.find(g => g.name.toLowerCase() === String(rawGender).toLowerCase() || g.id === String(rawGender));
    const resolvedGender = foundGender ? foundGender.id : '2';

    // Normalize gallery keys to use metal IDs instead of metal names
    const normalizedGallery: Record<string, string[]> = {};
    Object.keys(parsedGallery).forEach(key => {
      const found = METAL_TYPES.find(m => m.name.toLowerCase() === key.toLowerCase() || m.id === key);
      const targetKey = found ? found.id : key;
      normalizedGallery[targetKey] = (parsedGallery as any)[key];
    });

    // Omit server-managed timestamps and internal fields from form state
    const {
      create_date: _cd,
      modify_date: _md,
      createdAt: _ca,
      updatedAt: _ua,
      __v: _v,
      ...productBase
    } = product;

    return {
      ...productBase,
      price: Number(product.price || 0),
      discount: Number(product.discount || 0),
      stock: Number(product.stock || 0),
      height: Number(product.height || 0),
      width: Number(product.width || 0),
      gold_weight: Number(product.gold_weight || 0),
      diamond_weight: Number(product.diamond_weight || 0),
      diamond_count: Number(product.diamond_count || 0),
      solitaires_weight: Number(product.solitaires_weight || product.solitaire_weight || 0),
      solitaire_weight: Number(product.solitaire_weight || product.solitaires_weight || 0),
      solitaires_price: Number(product.solitaires_price || 0),
      product_weight: Number(product.product_weight || 0),
      center_diamond_weight: product.center_diamond_weight !== null ? Number(product.center_diamond_weight) : null,
      center_diamond_price: product.center_diamond_price !== null ? Number(product.center_diamond_price) : null,
      gemstone_info: product.gemstone_info || null,
      gemstone_weight: Number(product.gemstone_weight || 0),
      gemstone_price: Number(product.gemstone_price || 0),
      noof_gem: Number(product.noof_gem || 0),
      color_stone: product.color_stone || null,
      color_stone_weight: Number(product.color_stone_weight || 0),
      color_stone_count: Number(product.color_stone_count || 0),
      color_stone_price: Number(product.color_stone_price || 0),
      gallery: normalizedGallery,
      metal_type: resolvedMetalType,
      gender: resolvedGender,
      diamond_rate_ij_si: Number(product.diamond_rate_ij_si || 0),
      diamond_rate_gh_vs: Number(product.diamond_rate_gh_vs || 0),
      diamond_rate_ef_vvs: Number(product.diamond_rate_ef_vvs || 0),
      diamond_rate_fg_si: Number(product.diamond_rate_fg_si || 0),
      custom_diamond_rates: parsedCustomDiamondRates,
      solitaire_price_ij_si: Number(product.solitaire_price_ij_si || 0),
      solitaire_price_gh_vs: Number(product.solitaire_price_gh_vs || 0),
      solitaire_price_ef_vvs: Number(product.solitaire_price_ef_vvs || 0),
      solitaire_price_fg_si: Number(product.solitaire_price_fg_si || 0),
      custom_solitaire_prices: parsedCustomSolPrices,
      solitaire_setting: product.solitaire_setting || product.solitaires_setting || 'Prong Setting',
      solitaires_setting: product.solitaires_setting || product.solitaire_setting || 'Prong Setting',
      banglesize_id: (product.banglesize_id && product.banglesize_id !== '0') ? String(product.banglesize_id).trim() : '2.6',
      making_charges: Number(product.making_charges || 0),
      makingCharges: Number(product.makingCharges || 0),
      is_set: product.is_set === true || product.is_set === 'true' || (Array.isArray(parsedSetItems) && parsedSetItems.length > 0) || (product.category_id || '').toLowerCase().includes('set'),
      set_items: parsedSetItems
    };
  };

  const [dailyRates, setDailyRates] = useState<any>(null);

  useEffect(() => {
    const fetchDailyRates = async () => {
      try {
        const data = await cachedFetch('/api/jewellery-pricing', { ttlMs: 120000 });
        if (data && data.success && data.data) {
          setDailyRates(data.data);
        }
      } catch (e) {
        console.error('Failed to fetch daily rates in ProductEditor', e);
      }
    };
    fetchDailyRates();

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${currentId}`);
        const data = await res.json();
        if (data.success) {
          const product = data.data;
          const sanitized = sanitizeIncomingProduct(product);
          setFormData(sanitized);
          setIncludeMetal(Number(product.gold_weight || 0) > 0 || isNew);
          setIncludeSolitaire(Number(product.solitaires_price || 0) > 0);
          const isPG = (product.product_type || '').toLowerCase().includes('gold');
          setIncludeDiamond(!isPG && (Number(product.diamond_weight || 0) > 0 || Number(product.diamond_count || 0) > 0));
          setIncludeGemstone(Number(product.gemstone_weight || 0) > 0 || Number(product.noof_gem || 0) > 0 || Number(product.gemstone_price || 0) > 0 || !!product.gemstone_info);
          setIncludeColorStone(Number(product.color_stone_weight || 0) > 0 || Number(product.color_stone_count || 0) > 0 || Number(product.color_stone_price || 0) > 0 || !!product.color_stone);
        } else {
          setError('Failed to load product data.');
        }
      } catch {
        setError('An error occurred while fetching the product.');
      } finally {
        setLoading(false);
      }
    };

    if (!isNew) {
      fetchProduct();
    }
  }, [currentId, isNew]);

  const getMetalWeightLabel = () => {
    const pt = (formData.product_type || '').toLowerCase();
    if (pt === 'silver' || activeMetals.includes('5')) {
      return 'Silver Weight (g) *';
    }
    if (pt === 'platinum' || activeMetals.includes('4')) {
      return 'Platinum Weight (g) *';
    }
    if (pt === 'gold' || pt.includes('plain gold')) {
      return 'Gold Weight (22k) *';
    }
    return 'Gold Weight (14k) *';
  };

  const isJewellerySet = (formData.category_id || '').toLowerCase().includes('set') ||
    formData.category_id === '11' ||
    formData.is_set === true ||
    (Array.isArray(formData.set_items) && formData.set_items.length > 0);

  const [selectedSetItemTab, setSelectedSetItemTab] = useState<string>('all');
  const [customItemInput, setCustomItemInput] = useState<string>('');
  const [expandedSetItems, setExpandedSetItems] = useState<Record<string, boolean>>({});

  const isItemExpanded = (key: string) => expandedSetItems[key] !== false;
  const toggleItemExpanded = (key: string) => {
    setExpandedSetItems(prev => ({
      ...prev,
      [key]: prev[key] === false ? true : false
    }));
  };

  const syncSetTotals = (items: SetItemData[]) => {
    const updatedItems = items.map(item => {
      const breakup = calculateSetItemPrice(item, dailyRates, formData.making_charges || 15);
      return {
        ...item,
        calculated_price: breakup.total,
        price_breakup: breakup
      };
    });

    const totalPrice = updatedItems.reduce((sum, it) => sum + (it.calculated_price || 0), 0);
    const totalProductWeight = updatedItems.reduce((sum, it) => sum + Number(it.product_weight || 0), 0);
    const totalGoldWeight = updatedItems.reduce((sum, it) => sum + (it.includeMetal !== false ? Number(it.gold_weight || it.product_weight || 0) : 0), 0);
    const totalDiamondWeight = updatedItems.reduce((sum, it) => sum + (it.includeDiamond !== false ? Number(it.diamond_weight || 0) : 0), 0);
    const totalDiamondCount = updatedItems.reduce((sum, it) => sum + (it.includeDiamond !== false ? Number(it.diamond_count || 0) : 0), 0);
    const totalGemstoneWeight = updatedItems.reduce((sum, it) => sum + (it.includeGemstone ? Number(it.gemstone_weight || 0) : 0), 0);
    const totalSolitaireWeight = updatedItems.reduce((sum, it) => sum + (it.includeSolitaire ? Number(it.solitaire_weight || 0) : 0), 0);

    setFormData(prev => ({
      ...prev,
      is_set: true,
      set_items: updatedItems,
      price: totalPrice > 0 ? totalPrice : prev.price,
      product_weight: Number(totalProductWeight.toFixed(3)),
      gold_weight: Number(totalGoldWeight.toFixed(3)),
      diamond_weight: Number(totalDiamondWeight.toFixed(2)),
      diamond_count: totalDiamondCount,
      gemstone_weight: Number(totalGemstoneWeight.toFixed(2)),
      solitaire_weight: Number(totalSolitaireWeight.toFixed(2)),
      solitaires_weight: Number(totalSolitaireWeight.toFixed(2))
    }));
  };

  const handleToggleSetItem = (preset: { id: string; name: string }) => {
    const currentItems = formData.set_items || [];
    const exists = currentItems.some(it => it.item_type === preset.id || it.name.toLowerCase() === preset.name.toLowerCase());

    let newItems: SetItemData[];
    if (exists) {
      newItems = currentItems.filter(it => it.item_type !== preset.id && it.name.toLowerCase() !== preset.name.toLowerCase());
    } else {
      const defaultKaratName = formData.karat_id ? (KARATS.find(k => k.id === formData.karat_id)?.name || '14K') : '14K';
      const newItemDraft: SetItemData = {
        id: `${preset.id}_${Date.now()}`,
        name: preset.name,
        item_type: preset.id,
        product_weight: 0,
        gold_weight: 0,
        karat: defaultKaratName,
        includeMetal: true,
        includeDiamond: formData.product_type !== 'gold',
        diamond_weight: 0,
        diamond_count: 0,
        diamond_quality: formData.diamond_quality || 'IJ-SI',
        diamond_rate: 0,
        includeSolitaire: false,
        solitaire_weight: 0,
        solitaire_quality: 'IJ-SI',
        solitaire_price: 0,
        solitaire_setting: 'Prong Setting',
        includeGemstone: false,
        gemstone_info: '',
        gemstone_weight: 0,
        gemstone_price: 0,
        noof_gem: 0,
        includeColorStone: false,
        color_stone: '',
        color_stone_weight: 0,
        color_stone_count: 0,
        color_stone_price: 0,
        making_charges: formData.making_charges || 15,
        calculated_price: 0
      };
      const breakup = calculateSetItemPrice(newItemDraft, dailyRates, formData.making_charges || 15);
      newItemDraft.calculated_price = breakup.total;
      newItemDraft.price_breakup = breakup;
      newItems = [...currentItems, newItemDraft];
    }

    syncSetTotals(newItems);
  };

  const handleAddCustomSetItem = (customName: string) => {
    if (!customName.trim()) return;
    const cleanName = customName.trim();
    const currentItems = formData.set_items || [];
    const defaultKaratName = formData.karat_id ? (KARATS.find(k => k.id === formData.karat_id)?.name || '14K') : '14K';
    const customId = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_');

    const newItemDraft: SetItemData = {
      id: `${customId}_${Date.now()}`,
      name: cleanName,
      item_type: customId,
      product_weight: 0,
      gold_weight: 0,
      karat: defaultKaratName,
      includeMetal: true,
      includeDiamond: formData.product_type !== 'gold',
      diamond_weight: 0,
      diamond_count: 0,
      diamond_quality: formData.diamond_quality || 'IJ-SI',
      diamond_rate: 0,
      includeSolitaire: false,
      solitaire_weight: 0,
      solitaire_quality: 'IJ-SI',
      solitaire_price: 0,
      solitaire_setting: 'Prong Setting',
      includeGemstone: false,
      gemstone_info: '',
      gemstone_weight: 0,
      gemstone_price: 0,
      noof_gem: 0,
      includeColorStone: false,
      color_stone: '',
      color_stone_weight: 0,
      color_stone_count: 0,
      color_stone_price: 0,
      making_charges: formData.making_charges || 15,
      calculated_price: 0
    };
    const breakup = calculateSetItemPrice(newItemDraft, dailyRates, formData.making_charges || 15);
    newItemDraft.calculated_price = breakup.total;
    newItemDraft.price_breakup = breakup;

    syncSetTotals([...currentItems, newItemDraft]);
    setCustomItemInput('');
  };

  const handleRemoveSetItem = (index: number) => {
    const currentItems = [...(formData.set_items || [])];
    currentItems.splice(index, 1);
    syncSetTotals(currentItems);
  };

  const handleUpdateSetItem = (index: number, updates: Partial<SetItemData>) => {
    const currentItems = [...(formData.set_items || [])];
    if (!currentItems[index]) return;

    const updatedItem = { ...currentItems[index], ...updates };
    if ('product_weight' in updates && (!updatedItem.gold_weight || updatedItem.gold_weight === currentItems[index].product_weight)) {
      updatedItem.gold_weight = Number(updates.product_weight || 0);
    }
    const breakup = calculateSetItemPrice(updatedItem, dailyRates, formData.making_charges || 15);
    updatedItem.calculated_price = breakup.total;
    updatedItem.price_breakup = breakup;
    currentItems[index] = updatedItem;

    syncSetTotals(currentItems);
  };

  const handleDuplicateSetItem = (index: number) => {
    const currentItems = [...(formData.set_items || [])];
    if (!currentItems[index]) return;
    const source = currentItems[index];
    const clone: SetItemData = {
      ...source,
      id: `${source.item_type}_${Date.now()}`,
      name: `${source.name} (Copy)`
    };
    currentItems.splice(index + 1, 0, clone);
    syncSetTotals(currentItems);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    // Generate product_id if not present
    const computedProductId = formData.product_id || `PROD-${Date.now()}`;

    // Validation
    const requiredFields = [
      { key: 'category_id', label: 'Select Category Name' },
      { key: 'subcategory_id', label: 'Select Subcategory' },
      { key: 'product_title', label: 'Enter Product Title' },
      { key: 'product_code', label: 'Enter Product Code' },
      { key: 'hsn_code', label: 'Enter Product HSN Code' },
      { key: 'product_type', label: 'Product Type' },
      { key: 'description', label: 'Enter Product Description' },
      { key: 'gender', label: 'Select Gender' },
      { key: 'karat_id', label: 'Select Karat' },
    ];

    for (const f of requiredFields) {
      const val = formData[f.key as keyof ProductFormData];
      if (val === undefined || val === null || String(val).trim() === '') {
        setError(`${f.label} is required.`);
        setSaving(false);
        return;
      }
    }

    if (isJewellerySet) {
      if (!formData.set_items || formData.set_items.length === 0) {
        setError('Please select at least one item included in this Jewellery Set (e.g. Necklace, Earrings, Nose Pin).');
        setSaving(false);
        return;
      }
      for (const item of formData.set_items) {
        if (!item.name || !item.name.trim()) {
          setError('All set items must have a valid name.');
          setSaving(false);
          return;
        }
        if (item.product_weight === undefined || item.product_weight === null || isNaN(Number(item.product_weight))) {
          setError(`Item "${item.name}" must have a valid weight specified.`);
          setSaving(false);
          return;
        }
      }
    }

    const numberFields = [
      { key: 'price', label: 'Price' },
      { key: 'discount', label: 'Enter Discount' },
      { key: 'stock', label: 'Enter Stock' },
      { key: 'product_weight', label: 'Product Weight' },
      { key: 'making_charges', label: 'Making Charges' }
    ];

    const isPlainGoldType = formData.product_type === 'gold' || (formData.product_type || '').toLowerCase().includes('plain gold');

    if (!isJewellerySet) {
      numberFields.push({ key: 'height', label: 'Height (mm)' });
      numberFields.push({ key: 'width', label: 'Width (mm)' });

      if (includeMetal) {
        numberFields.push({ key: 'gold_weight', label: getMetalWeightLabel().replace(' *', '') });
      }

      if (!isPlainGoldType && includeDiamond) {
        numberFields.push({ key: 'diamond_weight', label: 'Diamond Weight' });
        numberFields.push({ key: 'diamond_count', label: 'Diamond Count' });
      }

      if (includeGemstone) {
        numberFields.push({ key: 'gemstone_weight', label: 'Gemstone Weight' });
        numberFields.push({ key: 'noof_gem', label: 'Total Number Of GEM' });
        numberFields.push({ key: 'gemstone_price', label: 'Gemstone Price' });
      }

      if (includeColorStone) {
        numberFields.push({ key: 'color_stone_weight', label: 'Color Stone Weight' });
        numberFields.push({ key: 'color_stone_count', label: 'Color Stone Count' });
        numberFields.push({ key: 'color_stone_price', label: 'Color Stone Price' });
      }

      if (includeSolitaire) {
        numberFields.push({ key: 'solitaires_price', label: 'Solitaire Price' });
        numberFields.push({ key: 'solitaires_weight', label: 'Solitaire Weight' });
      }
    }

    for (const f of numberFields) {
      const val = formData[f.key as keyof ProductFormData];
      if (val === undefined || val === null || val === '' || isNaN(Number(val))) {
        setError(`${f.label} must be a valid number.`);
        setSaving(false);
        return;
      }
    }

    // Clean up category size values if sizing not applicable
    const categoryLower = (formData.category_id || '').toLowerCase();
    const isEarring = categoryLower.includes('earring') || formData.category_id === '6';
    const isRing = !isEarring && (formData.category_id === '1' || categoryLower === 'rings' || categoryLower === 'ring' || (categoryLower.includes('ring') && !categoryLower.includes('nose') && !categoryLower.includes('pendant') && !categoryLower.includes('necklace')));
    const isBangle = formData.category_id === '4' || formData.category_id === '5' || categoryLower === 'bangles' || categoryLower === 'bangle' || categoryLower.includes('bangle');
    const isTennisBracelet = formData.category_id === '8' || categoryLower === 'tennis bracelets' || categoryLower === 'tennis bracelet' || categoryLower === 'bracelets' || categoryLower === 'bracelet' || categoryLower.includes('bracelet');
    const isChain = categoryLower === 'chains' || categoryLower === 'chain' || categoryLower.includes('chain');
    const isMangalsutra = categoryLower === 'mangalsutra' || categoryLower === 'mangalsutras' || categoryLower.includes('mangalsutra');
    const showSizing = isRing || isBangle || isTennisBracelet || isChain || isMangalsutra;

    const cleanSizeId = showSizing ? formData.size_id : '';
    const cleanBangleSizeId = isBangle ? (formData.banglesize_id || '2.6') : '0';

    const {
      create_date: _cd,
      modify_date: _md,
      createdAt: _ca,
      updatedAt: _ua,
      __v: _v,
      ...safeFormData
    } = formData as any;

    const payload = {
      ...safeFormData,
      product_id: computedProductId,
      size_id: cleanSizeId,
      banglesize_id: cleanBangleSizeId,
      is_set: isJewellerySet,
      set_items: isJewellerySet ? (formData.set_items || []) : [],
      // Handle solitaire presence
      solitaires_price: includeSolitaire ? Number(formData.solitaires_price || 0) : 0,
      solitaires_quality: includeSolitaire ? formData.solitaires_quality : '0',
      custom_solitaire_prices: includeSolitaire ? (formData.custom_solitaire_prices || {}) : {},
      solitaires_weight: includeSolitaire ? Number(formData.solitaires_weight || formData.solitaire_weight || 0) : 0,
      solitaire_weight: includeSolitaire ? Number(formData.solitaire_weight || formData.solitaires_weight || 0) : 0,
      // Handle diamond presence
      diamond_weight: (isPlainGoldType || !includeDiamond) ? 0 : Number(formData.diamond_weight || 0),
      diamond_count: (isPlainGoldType || !includeDiamond) ? 0 : Number(formData.diamond_count || 0),
      diamond_quality: (isPlainGoldType || !includeDiamond) ? '' : formData.diamond_quality,
      custom_diamond_rates: (isPlainGoldType || !includeDiamond) ? {} : (formData.custom_diamond_rates || {}),
      // Handle gemstone presence
      gemstone_info: includeGemstone ? (formData.gemstone_info || null) : null,
      gemstone_weight: includeGemstone ? Number(formData.gemstone_weight || 0) : 0,
      gemstone_price: includeGemstone ? Number(formData.gemstone_price || 0) : 0,
      noof_gem: includeGemstone ? Number(formData.noof_gem || 0) : 0,
      // Handle color stone presence
      color_stone: includeColorStone ? (formData.color_stone || null) : null,
      color_stone_weight: includeColorStone ? Number(formData.color_stone_weight || 0) : 0,
      color_stone_count: includeColorStone ? Number(formData.color_stone_count || 0) : 0,
      color_stone_price: includeColorStone ? Number(formData.color_stone_price || 0) : 0,
      // Remove other deprecated fields
      custom_type: '0',
      center_diamond_weight: null,
      center_diamond_price: null
    };

    try {
      const url = isNew ? '/api/admin/products' : `/api/admin/products/${currentId}`;
      const method = isNew ? 'POST' : 'PATCH';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Masterpiece preserved in the vault.');
        invalidateCache('/api/admin/products');
        invalidateCache('/api/admin/categories/product-counts');
        if (onSaveSuccess) {
          onSaveSuccess(data.data);
        } else if (isNew) {
          window.history.replaceState(null, '', `?id=${data.data._id}`);
          const sanitized = sanitizeIncomingProduct(data.data);
          setFormData(sanitized);
          setIncludeSolitaire(Number(data.data.solitaires_price || 0) > 0);
          const isRespPG = (data.data.product_type || '').toLowerCase().includes('gold');
          setIncludeDiamond(!isRespPG && (Number(data.data.diamond_weight || 0) > 0 || Number(data.data.diamond_count || 0) > 0));
          setIncludeGemstone(Number(data.data.gemstone_weight || 0) > 0 || Number(data.data.noof_gem || 0) > 0 || Number(data.data.gemstone_price || 0) > 0 || !!data.data.gemstone_info);
          setIncludeColorStone(Number(data.data.color_stone_weight || 0) > 0 || Number(data.data.color_stone_count || 0) > 0 || Number(data.data.color_stone_price || 0) > 0 || !!data.data.color_stone);
        } else {
          const sanitized = sanitizeIncomingProduct(data.data);
          setFormData(sanitized);
          setIncludeSolitaire(Number(data.data.solitaires_price || 0) > 0);
          const isRespPG = (data.data.product_type || '').toLowerCase().includes('gold');
          setIncludeDiamond(!isRespPG && (Number(data.data.diamond_weight || 0) > 0 || Number(data.data.diamond_count || 0) > 0));
          setIncludeGemstone(Number(data.data.gemstone_weight || 0) > 0 || Number(data.data.noof_gem || 0) > 0 || Number(data.data.gemstone_price || 0) > 0 || !!data.data.gemstone_info);
          setIncludeColorStone(Number(data.data.color_stone_weight || 0) > 0 || Number(data.data.color_stone_count || 0) > 0 || Number(data.data.color_stone_price || 0) > 0 || !!data.data.color_stone);
        }
      } else {
        setError(data.message || 'The vault rejected the update.');
      }
    } catch {
      setError('A secure connection could not be established.');
    } finally {
      setSaving(false);
    }
  };

  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormData({
      ...formData,
      product_title: val,
      product_slug: isNew ? slug : formData.product_slug
    });
  };

  // Helper arrays for multi-select checkboxes
  const activeMetals = formData.metal_type ? formData.metal_type.split(',').map(s => s.trim()).filter(Boolean) : [];
  const activeKarats = formData.karat_id ? formData.karat_id.split(',').map(s => s.trim()).filter(Boolean) : [];
  const activeSizes = formData.size_id ? formData.size_id.split(',').map(s => s.trim()).filter(Boolean) : [];
  const activeDiamondQualities = formData.diamond_quality ? formData.diamond_quality.split(',').map(s => s.trim()).filter(Boolean) : [];
  const activeSolitaireQualities = formData.solitaires_quality ? formData.solitaires_quality.split(',').map(s => s.trim()).filter(Boolean) : [];

  const handleMetalToggle = (metalId: string) => {
    const newMetals = activeMetals.includes(metalId)
      ? activeMetals.filter(id => id !== metalId)
      : [...activeMetals, metalId];
    setFormData({ ...formData, metal_type: newMetals.join(',') });
  };

  const handleKaratToggle = (karatId: string) => {
    const newKarats = activeKarats.includes(karatId)
      ? activeKarats.filter(id => id !== karatId)
      : [...activeKarats, karatId];
    setFormData({ ...formData, karat_id: newKarats.join(',') });
  };

  const handleSizeToggle = (sizeId: string) => {
    const newSizes = activeSizes.includes(sizeId)
      ? activeSizes.filter(id => id !== sizeId)
      : [...activeSizes, sizeId];
    setFormData({ ...formData, size_id: newSizes.join(',') });
  };

  const handleDiamondQualityToggle = (qualityId: string, qualityName?: string) => {
    const isCurrentlySelected = activeDiamondQualities.includes(qualityId) || (qualityName ? activeDiamondQualities.includes(qualityName) : false);
    let newQualities: string[];
    if (isCurrentlySelected) {
      newQualities = activeDiamondQualities.filter(id => id !== qualityId && id !== (qualityName || ''));
    } else {
      newQualities = [...activeDiamondQualities, qualityId];
    }
    setFormData({ ...formData, diamond_quality: newQualities.join(',') });
  };

  const handleSolitaireQualityToggle = (qualityId: string, qualityName?: string) => {
    const isCurrentlySelected = activeSolitaireQualities.includes(qualityId) || (qualityName ? activeSolitaireQualities.includes(qualityName) : false);
    let newQualities: string[];
    if (isCurrentlySelected) {
      newQualities = activeSolitaireQualities.filter(id => id !== qualityId && id !== (qualityName || ''));
    } else {
      newQualities = [...activeSolitaireQualities, qualityId];
    }
    setFormData({ ...formData, solitaires_quality: newQualities.join(',') });
  };

  const handleAddCustomSolitairePurity = () => {
    const trimmed = customPurityInput.trim();
    if (!trimmed) return;
    const price = parseFloat(customPurityPriceInput) || 0;
    const currentCustomMap = { ...(formData.custom_solitaire_prices || {}) };
    currentCustomMap[trimmed] = price;

    const currentQualities = formData.solitaires_quality && formData.solitaires_quality !== '0'
      ? formData.solitaires_quality.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    if (!currentQualities.includes(trimmed)) {
      currentQualities.push(trimmed);
    }

    setFormData({
      ...formData,
      custom_solitaire_prices: currentCustomMap,
      solitaires_quality: currentQualities.join(','),
      solitaires_price: price > 0 ? price : formData.solitaires_price
    });
    setCustomPurityInput('');
    setCustomPurityPriceInput('');
  };

  const handleRemoveCustomSolitairePurity = (purityName: string) => {
    const currentCustomMap = { ...(formData.custom_solitaire_prices || {}) };
    delete currentCustomMap[purityName];

    const currentQualities = formData.solitaires_quality ? formData.solitaires_quality.split(',').map(s => s.trim()).filter(Boolean) : [];
    const newQualities = currentQualities.filter(q => q !== purityName);

    setFormData({
      ...formData,
      custom_solitaire_prices: currentCustomMap,
      solitaires_quality: newQualities.join(',')
    });
  };

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  if (loading) {
    return (
      <div className="py-40 flex flex-col items-center justify-center space-y-4 bg-transparent">
        <Loader2 className="text-brand-gold animate-spin" size={40} />
        <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-slate-400">Preparing Atelier...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24 font-sans text-left text-[#12100e]">
      {/* Top Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <a
            href="#"
            onClick={handleBackClick}
            className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-[#12100e]/70 hover:text-brand-gold transition-colors font-bold mb-4 animate-fade-in"
          >
            <ArrowLeft size={14} />
            <span>Return to Vault</span>
          </a>
          <h1 className="text-4xl font-serif font-bold text-[#12100e] italic">
            {isNew ? 'Create New' : 'Refine'} <span className="not-italic text-[#12100e]/30">Masterpiece</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {!isNew && (
            <a
              href={`/product/${formData.product_slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 px-6 py-4 bg-white/60 text-[#12100e]/60 rounded-2xl border border-slate-200 hover:border-brand-gold/40 transition-all text-[12px] font-bold uppercase tracking-widest shadow-sm"
            >
              <ExternalLink size={16} />
              <span>Preview</span>
            </a>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-3 px-10 py-4 bg-[#5d463c] hover:bg-[#4c3931] text-[#efe7e5] rounded-2xl font-bold text-[12px] uppercase tracking-[0.3em] transition-all duration-500 shadow-md disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            <span>{isNew ? 'Initialize' : 'Preserve'}</span>
          </button>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-4xl flex items-center space-x-4 text-red-600 animate-in fade-in slide-in-from-top-4">
          <AlertCircle size={20} />
          <p className="text-[12px] font-bold uppercase tracking-widest">{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-4xl flex items-center space-x-4 text-emerald-600 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={20} />
          <p className="text-[12px] font-bold uppercase tracking-widest">{success}</p>
        </div>
      )}

      {/* Editor Tabs */}
      <div className="flex items-center space-x-2 p-2 bg-white/60 rounded-2xl sm:rounded-3xl border border-slate-200/80 max-w-full overflow-x-auto no-scrollbar shadow-sm backdrop-blur-sm whitespace-nowrap shrink-0">
        {[
          { id: 'basic', label: 'Identity', icon: Settings },
          { id: 'pricing', label: 'Value & Inventory', icon: Coins },
          { id: 'media', label: 'Media Gallery', icon: ImageIcon },
          { id: 'specs', label: 'Jewellery Details', icon: FileText },
          { id: 'attributes', label: 'Configuration & Options', icon: Layers },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-500 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap',
              activeTab === tab.id
                ? 'bg-[#5d463c] text-[#efe7e5] shadow-sm'
                : 'text-[#12100e]/70 hover:text-[#12100e] hover:bg-white/30'
            )}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Form Sections */}
      <div className="grid grid-cols-1 gap-12 text-left">
        {activeTab === 'basic' && (
          <div className="bg-white border border-slate-200/80 rounded-[40px] p-10 space-y-10 shadow-sm transition-all">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Select Category Name*</label>
                <select
                  value={
                    isCustomCategory
                      ? 'Other'
                      : CATEGORIES.some(c => c.name.toLowerCase() === (formData.category_id || '').toLowerCase())
                        ? CATEGORIES.find(c => c.name.toLowerCase() === (formData.category_id || '').toLowerCase())?.name
                        : (formData.category_id ? 'Other' : '')
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'Other') {
                      setIsCustomCategory(true);
                      setFormData({ ...formData, category_id: '' });
                    } else {
                      setIsCustomCategory(false);
                      const isSet = val.toLowerCase().includes('set') || val === '11' || val === 'Jewellery Set';
                      setFormData(prev => ({
                        ...prev,
                        category_id: val,
                        is_set: isSet ? true : prev.is_set
                      }));
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] text-[#12100e] focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-inner"
                >
                  <option value="">-- Select Category --</option>
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  <option value="Other">Other / Custom Category...</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Select Subcategory*</label>
                <input
                  type="text"
                  list="subcategory-options"
                  placeholder="Enter or select Subcategory Name"
                  value={formData.subcategory_id}
                  onChange={(e) => setFormData({ ...formData, subcategory_id: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] text-[#12100e] focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-inner"
                />
                <datalist id="subcategory-options">
                  {SUBCATEGORIES.map(s => (
                    <option key={s.id} value={s.name} />
                  ))}
                </datalist>
              </div>

              {(isCustomCategory || (formData.category_id && !CATEGORIES.some(c => c.name.toLowerCase() === (formData.category_id || '').toLowerCase()))) && (
                <div className="space-y-4 col-span-1 md:col-span-2 bg-amber-50/50 p-6 rounded-3xl border border-amber-200/80">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-amber-800 block">Custom / Extra Category Field*</label>
                  <input
                    type="text"
                    placeholder="Enter Custom Category Name (e.g. Brooches, Anklets)"
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full bg-white border border-amber-300 rounded-2xl py-4 px-6 text-[14px] text-[#12100e] focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-inner"
                  />
                </div>
              )}

              {/* Jewellery Set Item Selection */}
              {isJewellerySet && (
                <div className="col-span-1 md:col-span-2 bg-[#5d463c]/5 border-2 border-[#5d463c]/20 rounded-3xl p-6 sm:p-8 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#5d463c]/15 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-[#5d463c]" />
                        <h4 className="text-[15px] font-serif font-bold text-[#12100e] tracking-wide">
                          Select Included Items in this Jewellery Set
                        </h4>
                      </div>
                      <p className="text-[12px] text-[#12100e]/70 mt-1">
                        Select which items are included in this set (e.g. Necklace, Earrings, Nose Pin). Each item will appear in the &ldquo;Jewellery Details&rdquo; tab to configure its individual specifications and price.
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-[#5d463c]/10 px-4 py-2 rounded-xl text-[12px] font-bold text-[#5d463c] shrink-0">
                      <span>{(formData.set_items || []).length} Item(s) Selected</span>
                    </div>
                  </div>

                  {/* Predefined Quick-Select Chips */}
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.25em] font-black text-[#5d463c] block">
                      Common Jewellery Pieces (Click to Include / Exclude)
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {PREDEFINED_SET_ITEMS.map(preset => {
                        const isSelected = (formData.set_items || []).some(
                          it => it.item_type === preset.id || it.name.toLowerCase() === preset.name.toLowerCase()
                        );
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => handleToggleSetItem(preset)}
                            className={cn(
                              "px-4 py-2.5 rounded-2xl text-[13px] font-semibold transition-all duration-200 flex items-center gap-2 border cursor-pointer",
                              isSelected
                                ? "bg-[#5d463c] text-white border-[#5d463c] shadow-md shadow-[#5d463c]/20"
                                : "bg-white text-[#12100e]/80 border-slate-200 hover:border-[#5d463c]/40 hover:bg-[#5d463c]/5"
                            )}
                          >
                            <span className={cn(
                              "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors",
                              isSelected ? "border-white bg-white/20 text-white" : "border-slate-300 text-slate-400"
                            )}>
                              {isSelected ? "✓" : "+"}
                            </span>
                            <span>{preset.icon}</span>
                            <span>{preset.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add Custom Piece */}
                  <div className="pt-2 border-t border-[#5d463c]/10 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Add custom piece (e.g. Choker, Haathphool, Kamarbandh, Brooch)..."
                        value={customItemInput}
                        onChange={(e) => setCustomItemInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomSetItem(customItemInput);
                          }
                        }}
                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 px-5 text-[13px] text-[#12100e] focus:ring-1 focus:ring-brand-gold/50 shadow-inner"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddCustomSetItem(customItemInput)}
                      disabled={!customItemInput.trim()}
                      className="px-6 py-3 bg-[#5d463c] hover:bg-[#4a372f] disabled:opacity-40 text-white text-[12px] font-bold uppercase tracking-wider rounded-2xl transition-all shadow-sm cursor-pointer"
                    >
                      + Add Custom Item
                    </button>
                  </div>

                  {/* Current Selected Items summary tags */}
                  {(formData.set_items || []).length > 0 ? (
                    <div className="pt-4 border-t border-[#5d463c]/10 space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.25em] font-black text-[#5d463c] block">
                        Included Set Pieces ({formData.set_items?.length})
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(formData.set_items || []).map((it, idx) => (
                          <div
                            key={it.id || idx}
                            className="inline-flex items-center gap-2 bg-white border border-[#5d463c]/30 rounded-xl px-3.5 py-2 text-[12px] font-medium text-[#12100e] shadow-sm"
                          >
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="font-bold">{it.name}</span>
                            {it.calculated_price && it.calculated_price > 0 ? (
                              <span className="text-[11px] text-[#5d463c] font-semibold bg-[#5d463c]/10 px-2 py-0.5 rounded-md">
                                ₹{Math.round(it.calculated_price).toLocaleString('en-IN')}
                              </span>
                            ) : null}
                            <button
                              type="button"
                              onClick={() => handleRemoveSetItem(idx)}
                              className="text-slate-400 hover:text-red-500 font-bold ml-1 transition-colors cursor-pointer"
                              title="Remove this item"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="pt-3 text-[12px] text-amber-700 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/60">
                      💡 <strong>Notice:</strong> Please select at least one item (e.g. Necklace, Earrings) to configure details in this jewellery set.
                    </div>
                  )}
                </div>
              )}
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Enter Product Title*</label>
                <input
                  type="text"
                  value={formData.product_title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] text-[#12100e] focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-inner"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Secure Slug</label>
                <input
                  type="text"
                  value={formData.product_slug}
                  onChange={(e) => setFormData({ ...formData, product_slug: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] text-[#12100e] focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-inner"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Enter Product Code*</label>
                <input
                  type="text"
                  value={formData.product_code}
                  onChange={(e) => setFormData({ ...formData, product_code: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] text-[#12100e] focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-inner"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Enter Product HSN Code*</label>
                <input
                  type="text"
                  value={formData.hsn_code}
                  onChange={(e) => setFormData({ ...formData, hsn_code: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] text-[#12100e] focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-inner"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Product Type*</label>
                <select
                  value={formData.product_type}
                  onChange={(e) => {
                    const newType = e.target.value;
                    const isPG = newType === 'gold' || newType.toLowerCase().includes('gold');
                    setFormData({
                      ...formData,
                      product_type: newType,
                      ...(isPG ? {
                        diamond_weight: 0,
                        diamond_count: 0,
                        diamond_quality: '',
                        custom_diamond_rates: {}
                      } : {})
                    });
                    if (isPG) {
                      setIncludeDiamond(false);
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] text-[#12100e] focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-inner"
                >
                  <option value="diamond">Diamond Jewelry</option>
                  <option value="gold">Plain Gold Jewelry</option>
                  <option value="solitaire">Solitaire Jewelry</option>
                  <option value="gemstone">Gemstone Jewelry</option>
                  <option value="silver">Silver Jewelry</option>
                  <option value="platinum">Platinum Jewelry</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Select Gender*</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] text-[#12100e] focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-inner"
                >
                  {GENDERS.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Custom Type</label>
                <input
                  type="text"
                  value={formData.custom_type}
                  onChange={(e) => setFormData({ ...formData, custom_type: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] text-[#12100e] focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-inner"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Visibility</label>
                <div className="flex items-center space-x-6 h-15">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: '1' })}
                    className={cn(
                      'flex-1 flex items-center justify-center space-x-3 px-6 py-3 rounded-xl border transition-all duration-500',
                      formData.status === '1' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 font-bold' : 'bg-white border-slate-200 text-[#12100e]/30'
                    )}
                  >
                    <Eye size={16} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Live</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: '0' })}
                    className={cn(
                      'flex-1 flex items-center justify-center space-x-3 px-6 py-3 rounded-xl border transition-all duration-500',
                      formData.status === '0' ? 'bg-red-500/10 border-red-500/30 text-red-600 font-bold' : 'bg-white border-slate-200 text-[#12100e]/30'
                    )}
                  >
                    <EyeOff size={16} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Archive</span>
                  </button>
                </div>
              </div>

              {/* Marketing Toggles */}
              <div className="space-y-4 col-span-1 md:col-span-2 grid grid-cols-3 gap-6 pt-4 border-t border-slate-200/80">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold block">Featured product</label>
                  <select
                    value={formData.feature}
                    onChange={(e) => setFormData({ ...formData, feature: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-[12px] text-[#12100e]"
                  >
                    <option value="0">Standard</option>
                    <option value="1">Featured</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold block">Top Selling</label>
                  <select
                    value={formData.topselling}
                    onChange={(e) => setFormData({ ...formData, topselling: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-[12px] text-[#12100e]"
                  >
                    <option value="0">Standard</option>
                    <option value="1">Top Selling</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold block">Sessional Collection</label>
                  <select
                    value={formData.sessional}
                    onChange={(e) => setFormData({ ...formData, sessional: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-[12px] text-[#12100e]"
                  >
                    <option value="0">Standard</option>
                    <option value="1">Sessional</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Enter Product Description*</label>
              <textarea
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-4xl py-6 px-8 text-[14px] leading-relaxed text-[#12100e] focus:ring-1 focus:ring-brand-gold/50 transition-all shadow-inner"
              />
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="bg-white border border-slate-200/80 rounded-[40px] p-10 space-y-10 shadow-sm">
            {isJewellerySet && (
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-[13px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Jewellery Set Price Calculation Active
                  </h4>
                  <p className="text-[12px] text-amber-800/80 mt-1">
                    The total set price is automatically calculated as the sum of all individual item prices configured in the &ldquo;Jewellery Details&rdquo; tab.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => syncSetTotals(formData.set_items || [])}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[12px] font-bold uppercase tracking-wider transition-colors shrink-0 flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Recalculate Set Prices
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">
                  Price (₹) {isJewellerySet && <span className="text-amber-700 font-normal">(Auto Total)</span>}
                </label>
                <input
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] font-bold text-brand-gold transition-all shadow-inner"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Discount (%)</label>
                <input
                  type="number"
                  value={formData.discount || ''}
                  onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] font-bold text-[#12100e] transition-all shadow-inner"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Stock Count</label>
                <input
                  type="number"
                  value={formData.stock || ''}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] font-bold text-[#12100e] transition-all shadow-inner"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">
                  Total Product Weight (g) {isJewellerySet && <span className="text-amber-700 font-normal">(Sum)</span>}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.product_weight || ''}
                  onChange={(e) => setFormData({ ...formData, product_weight: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] font-bold text-[#12100e] transition-all shadow-inner"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Making Charges (%)</label>
                <input
                  type="number"
                  value={formData.making_charges || ''}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    setFormData({ ...formData, making_charges: val, makingCharges: val });
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] font-bold text-[#12100e] transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Set Items Price & Specification Breakdown Table */}
            {isJewellerySet && (formData.set_items || []).length > 0 && (
              <div className="space-y-4 pt-6 border-t border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-[12px] uppercase tracking-[0.25em] font-black text-brand-gold">
                    Individual Set Item Price Breakdown
                  </h4>
                  <span className="text-[13px] font-bold text-[#5d463c]">
                    Grand Total Set Price: ₹{Math.round(formData.price || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-[12px]">
                    <thead className="bg-slate-50 text-[10px] uppercase tracking-wider font-bold text-[#12100e]/70 border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-4">Item</th>
                        <th className="py-3.5 px-4">Karat</th>
                        <th className="py-3.5 px-4">Gross Wt</th>
                        <th className="py-3.5 px-4">Net Gold Wt</th>
                        <th className="py-3.5 px-4">Gold Price</th>
                        <th className="py-3.5 px-4">Diamonds</th>
                        <th className="py-3.5 px-4">Solitaires / Gems</th>
                        <th className="py-3.5 px-4">Making Chg</th>
                        <th className="py-3.5 px-4">GST (3%)</th>
                        <th className="py-3.5 px-4 text-right">Individual Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(formData.set_items || []).map((it, idx) => {
                        const b = it.price_breakup || calculateSetItemPrice(it, dailyRates, formData.making_charges || 15);
                        return (
                          <tr key={it.id || idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 px-4 font-bold text-[#12100e]">{it.name}</td>
                            <td className="py-3 px-4 text-[#12100e]/80">{it.karat || '14K'}</td>
                            <td className="py-3 px-4">{it.product_weight || 0} g</td>
                            <td className="py-3 px-4">{b.net_gold_weight || it.gold_weight || 0} g</td>
                            <td className="py-3 px-4 font-medium">₹{Math.round(b.gold_cost).toLocaleString('en-IN')}</td>
                            <td className="py-3 px-4">
                              {it.includeDiamond !== false && it.diamond_weight ? (
                                <span>{it.diamond_weight} ct (₹{Math.round(b.diamond_cost).toLocaleString('en-IN')})</span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {(b.solitaire_cost || 0) + (b.gemstone_cost || 0) + (b.color_stone_cost || 0) > 0 ? (
                                <span>₹{Math.round((b.solitaire_cost || 0) + (b.gemstone_cost || 0) + (b.color_stone_cost || 0)).toLocaleString('en-IN')}</span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="py-3 px-4">₹{Math.round(b.making_charges).toLocaleString('en-IN')} ({it.making_charges ?? formData.making_charges ?? 15}%)</td>
                            <td className="py-3 px-4">₹{Math.round(b.gst).toLocaleString('en-IN')}</td>
                            <td className="py-3 px-4 text-right font-bold text-[#5d463c] text-[13px]">
                              ₹{Math.round(b.total).toLocaleString('en-IN')}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-[#5d463c]/5 border-t-2 border-[#5d463c]/20 font-bold text-[#12100e]">
                      <tr>
                        <td className="py-4 px-4 font-black">TOTAL SET</td>
                        <td className="py-4 px-4">—</td>
                        <td className="py-4 px-4">{formData.product_weight} g</td>
                        <td className="py-4 px-4">{formData.gold_weight} g</td>
                        <td className="py-4 px-4">—</td>
                        <td className="py-4 px-4">{formData.diamond_weight} ct ({formData.diamond_count} pcs)</td>
                        <td className="py-4 px-4">—</td>
                        <td className="py-4 px-4">—</td>
                        <td className="py-4 px-4">—</td>
                        <td className="py-4 px-4 text-right text-[15px] font-black text-[#5d463c]">
                          ₹{Math.round(formData.price || 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'media' && (
          <div className="bg-white border border-slate-200/80 rounded-[40px] p-10 space-y-10 shadow-sm">
            {activeMetals.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-3xl">
                <p className="text-[12px] uppercase tracking-widest text-[#12100e]/50">
                  Please select active Metal Types in the &ldquo;Configuration & Options&rdquo; tab first.
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                <p className="text-[11px] text-[#12100e]/70 leading-relaxed uppercase tracking-widest">
                  Map high-resolution image galleries to their corresponding metal variants.
                </p>
                {activeMetals.map((metalId) => {
                  const metalObj = METAL_TYPES.find(m => m.id === metalId);
                  const metalName = metalObj ? metalObj.name : `Metal ID: ${metalId}`;
                  const metalImages = formData.gallery[metalId] || [];

                  return (
                    <div key={metalId} className="bg-slate-50 border border-slate-200 rounded-[28px] p-8 space-y-6">
                      <h3 className="text-md font-serif font-bold text-brand-gold uppercase tracking-wider">{metalName} Assets</h3>
                      <AdminImageUploader
                        images={metalImages}
                        onChange={(newImages) => {
                          setFormData({
                            ...formData,
                            gallery: {
                              ...formData.gallery,
                              [metalId]: newImages
                            }
                          });
                        }}
                        category={formData.category_id || 'products'}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'specs' && (
          isJewellerySet ? (
            <div className="space-y-8">
              {/* Grand Summary Banner */}
              <div className="bg-gradient-to-br from-[#5d463c] via-[#4a372f] to-[#2c1810] text-[#efe7e5] rounded-[40px] p-8 sm:p-10 shadow-xl space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-300" />
                      <span className="text-[11px] uppercase tracking-[0.3em] font-black text-amber-300">
                        Jewellery Set Masterpieces
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                      Section-Wise Item Details & Specifications
                    </h3>
                    <p className="text-[13px] text-white/70 max-w-2xl mt-1 leading-relaxed">
                      Enter individual weights, metals, diamonds, and gemstones for each piece. Price is computed per piece and aggregated for total price breakdown.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => syncSetTotals(formData.set_items || [])}
                      className="px-5 py-3 bg-white/15 hover:bg-white/25 border border-white/20 text-white rounded-2xl text-[12px] font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <RefreshCw className="w-4 h-4 text-amber-300" />
                      Recalculate All Pieces
                    </button>
                  </div>
                </div>

                {/* Aggregate Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="bg-black/25 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <span className="text-[10px] uppercase tracking-wider text-amber-300 block font-bold">Total Set Price</span>
                    <span className="text-lg sm:text-xl font-bold font-serif text-white mt-1 block">
                      ₹{Math.round(formData.price || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="bg-black/25 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <span className="text-[10px] uppercase tracking-wider text-white/60 block font-bold">Total Gross Wt</span>
                    <span className="text-lg sm:text-xl font-bold font-serif text-white mt-1 block">
                      {formData.product_weight || 0} g
                    </span>
                  </div>
                  <div className="bg-black/25 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <span className="text-[10px] uppercase tracking-wider text-white/60 block font-bold">Total Gold Wt</span>
                    <span className="text-lg sm:text-xl font-bold font-serif text-white mt-1 block">
                      {formData.gold_weight || 0} g
                    </span>
                  </div>
                  <div className="bg-black/25 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <span className="text-[10px] uppercase tracking-wider text-white/60 block font-bold">Total Diamonds</span>
                    <span className="text-lg sm:text-xl font-bold font-serif text-white mt-1 block">
                      {formData.diamond_weight || 0} ct
                    </span>
                  </div>
                  <div className="bg-black/25 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <span className="text-[10px] uppercase tracking-wider text-white/60 block font-bold">Diamond Count</span>
                    <span className="text-lg sm:text-xl font-bold font-serif text-white mt-1 block">
                      {formData.diamond_count || 0} pcs
                    </span>
                  </div>
                  <div className="bg-black/25 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <span className="text-[10px] uppercase tracking-wider text-white/60 block font-bold">Included Pieces</span>
                    <span className="text-lg sm:text-xl font-bold font-serif text-white mt-1 block">
                      {(formData.set_items || []).length} Items
                    </span>
                  </div>
                </div>

                {/* Sub-tab navigation to focus on a single piece or show all */}
                {(formData.set_items || []).length > 0 && (
                  <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setSelectedSetItemTab('all')}
                      className={cn(
                        "px-4 py-2 rounded-xl text-[12px] font-bold tracking-wider uppercase transition-all cursor-pointer border",
                        selectedSetItemTab === 'all'
                          ? "bg-amber-400 text-stone-900 border-amber-300 shadow-md"
                          : "bg-white/10 text-white/80 border-white/10 hover:bg-white/20"
                      )}
                    >
                      All Pieces ({(formData.set_items || []).length})
                    </button>
                    {(formData.set_items || []).map((it, idx) => (
                      <button
                        key={it.id || idx}
                        type="button"
                        onClick={() => setSelectedSetItemTab(it.id || String(idx))}
                        className={cn(
                          "px-4 py-2 rounded-xl text-[12px] font-bold tracking-wider transition-all cursor-pointer border flex items-center gap-2",
                          selectedSetItemTab === (it.id || String(idx))
                            ? "bg-amber-400 text-stone-900 border-amber-300 shadow-md"
                            : "bg-white/10 text-white/80 border-white/10 hover:bg-white/20"
                        )}
                      >
                        <span>{it.name}</span>
                        {it.calculated_price && it.calculated_price > 0 ? (
                          <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded font-black",
                            selectedSetItemTab === (it.id || String(idx)) ? "bg-stone-900/10 text-stone-900" : "bg-black/30 text-amber-300"
                          )}>
                            ₹{Math.round(it.calculated_price).toLocaleString('en-IN')}
                          </span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Add More Pieces Bar in Specs Tab */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#5d463c]" />
                  <span className="text-[12px] font-bold text-[#12100e] uppercase tracking-wider">
                    Quick Add / Toggle Piece:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  {PREDEFINED_SET_ITEMS.map(preset => {
                    const isSelected = (formData.set_items || []).some(
                      it => it.item_type === preset.id || it.name.toLowerCase() === preset.name.toLowerCase()
                    );
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleToggleSetItem(preset)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider border transition-colors cursor-pointer flex items-center gap-1.5",
                          isSelected
                            ? "bg-[#5d463c] text-white border-[#5d463c]"
                            : "bg-slate-50 text-[#12100e]/70 border-slate-200 hover:border-[#5d463c]/40"
                        )}
                      >
                        <span>{isSelected ? "✓" : "+"}</span>
                        <span>{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Empty state if no set items yet */}
              {(!formData.set_items || formData.set_items.length === 0) && (
                <div className="bg-white border-2 border-dashed border-amber-300 rounded-[32px] p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-amber-100 text-[#5d463c] flex items-center justify-center mx-auto text-2xl">
                    💎
                  </div>
                  <h4 className="text-xl font-serif font-bold text-[#12100e]">
                    No Jewellery Set Items Selected Yet
                  </h4>
                  <p className="text-[13px] text-[#12100e]/60 max-w-md mx-auto leading-relaxed">
                    Select which pieces are included in this set (e.g. Necklace, Earrings, Nose Pin) using the buttons above or in the &ldquo;Identity&rdquo; tab to configure each piece&rsquo;s details.
                  </p>
                </div>
              )}

              {/* Section-Wise Item Cards */}
              <div className="space-y-8">
                {(formData.set_items || []).map((item, index) => {
                  const itemId = item.id || String(index);
                  if (selectedSetItemTab !== 'all' && selectedSetItemTab !== itemId) {
                    return null;
                  }

                  const breakup = item.price_breakup || calculateSetItemPrice(item, dailyRates, formData.making_charges || 15);
                  const expanded = isItemExpanded(itemId);

                  return (
                    <div
                      key={itemId}
                      className="bg-white border-2 border-[#5d463c]/20 rounded-[36px] overflow-hidden shadow-sm transition-all hover:border-[#5d463c]/40"
                    >
                      {/* Section Card Header */}
                      <div className="bg-gradient-to-r from-[#5d463c]/10 via-[#5d463c]/5 to-transparent p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200">
                        <div className="flex items-center gap-4 flex-wrap flex-1">
                          <span className="w-9 h-9 rounded-2xl bg-[#5d463c] text-white flex items-center justify-center font-bold text-[14px] shrink-0 shadow-sm">
                            #{index + 1}
                          </span>
                          <div className="flex-1 min-w-[200px]">
                            <div className="flex items-center gap-3">
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => handleUpdateSetItem(index, { name: e.target.value })}
                                placeholder="Item Name (e.g. Necklace)"
                                className="font-serif font-bold text-xl text-[#12100e] bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#5d463c] focus:bg-white px-2 py-0.5 rounded-lg outline-none transition-all"
                              />
                              <span className="text-[11px] font-bold text-[#5d463c] uppercase tracking-wider bg-white/80 border border-[#5d463c]/20 px-2.5 py-1 rounded-lg">
                                {item.item_type || 'piece'}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#12100e]/60 mt-1 px-2">
                              <span>Gross Wt: <strong>{item.product_weight || 0}g</strong></span>
                              <span>•</span>
                              <span>Karat: <strong>{item.karat || '14K'}</strong></span>
                              {item.includeDiamond !== false && (item.diamond_weight || 0) > 0 && (
                                <>
                                  <span>•</span>
                                  <span>Diamonds: <strong>{item.diamond_weight}ct ({item.diamond_count || 0}pcs)</strong></span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Header: Live Item Price & Actions */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/15 border border-amber-500/30 px-5 py-2.5 rounded-2xl text-right">
                            <span className="text-[9px] uppercase tracking-wider text-amber-900 block font-bold">Individual Price</span>
                            <span className="text-lg font-bold font-serif text-[#5d463c]">
                              ₹{Math.round(breakup.total).toLocaleString('en-IN')}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDuplicateSetItem(index)}
                            title="Duplicate this item"
                            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#12100e]/70 hover:text-[#12100e] rounded-2xl transition-colors cursor-pointer"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveSetItem(index)}
                            title="Remove this item from set"
                            className="p-3 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-2xl transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleItemExpanded(itemId)}
                            className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#12100e]/70 rounded-2xl transition-colors cursor-pointer"
                          >
                            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Section Card Body (Specs inputs) */}
                      {expanded && (
                        <div className="p-8 sm:p-10 space-y-10">
                          {/* Feature Toggles for this specific piece */}
                          <div className="bg-[#5d463c]/5 border border-[#5d463c]/15 rounded-3xl p-5 flex flex-wrap gap-6 justify-around">
                            <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={item.includeMetal !== false}
                                onChange={(e) => handleUpdateSetItem(index, { includeMetal: e.target.checked })}
                                className="w-4 h-4 accent-[#5d463c] rounded"
                              />
                              <span className="text-[11px] uppercase tracking-wider font-bold text-[#12100e]">Includes Gold</span>
                            </label>

                            <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={item.includeDiamond !== false}
                                onChange={(e) => handleUpdateSetItem(index, { includeDiamond: e.target.checked })}
                                className="w-4 h-4 accent-[#5d463c] rounded"
                              />
                              <span className="text-[11px] uppercase tracking-wider font-bold text-[#12100e]">Includes Diamonds</span>
                            </label>

                            <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={!!item.includeSolitaire}
                                onChange={(e) => handleUpdateSetItem(index, { includeSolitaire: e.target.checked })}
                                className="w-4 h-4 accent-[#5d463c] rounded"
                              />
                              <span className="text-[11px] uppercase tracking-wider font-bold text-[#12100e]">Includes Solitaires</span>
                            </label>

                            <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={!!item.includeGemstone}
                                onChange={(e) => handleUpdateSetItem(index, { includeGemstone: e.target.checked })}
                                className="w-4 h-4 accent-[#5d463c] rounded"
                              />
                              <span className="text-[11px] uppercase tracking-wider font-bold text-[#12100e]">Includes Gemstones</span>
                            </label>

                            <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={!!item.includeColorStone}
                                onChange={(e) => handleUpdateSetItem(index, { includeColorStone: e.target.checked })}
                                className="w-4 h-4 accent-[#5d463c] rounded"
                              />
                              <span className="text-[11px] uppercase tracking-wider font-bold text-[#12100e]">Includes Color Stones</span>
                            </label>
                          </div>

                          {/* Core Weights & Metal Specifications */}
                          <div className="space-y-4">
                            <h4 className="text-[11px] uppercase tracking-[0.25em] font-black text-brand-gold">
                              1. Metal & Physical Dimensions
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                              <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-wider font-bold text-[#12100e]/70 block">
                                  Gross Item Weight (g) *
                                </label>
                                <input
                                  type="number"
                                  step="0.001"
                                  placeholder="0.000"
                                  value={item.product_weight ?? ''}
                                  onChange={(e) => handleUpdateSetItem(index, { product_weight: parseFloat(e.target.value) || 0 })}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 text-[13px] font-bold text-[#12100e] shadow-inner"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-wider font-bold text-[#12100e]/70 block">
                                  Gold / Metal Karat *
                                </label>
                                <select
                                  value={item.karat || '14K'}
                                  onChange={(e) => handleUpdateSetItem(index, { karat: e.target.value })}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 text-[13px] font-bold text-[#12100e] shadow-inner"
                                >
                                  {KARATS.map(k => (
                                    <option key={k.id} value={k.name}>{k.name} Gold</option>
                                  ))}
                                  <option value="24K">24K Pure Gold</option>
                                  <option value="Platinum 950">Platinum 950</option>
                                  <option value="925 Silver">925 Sterling Silver</option>
                                </select>
                              </div>

                              <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-wider font-bold text-[#12100e]/70 block">
                                  Height (mm)
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00"
                                  value={item.height ?? ''}
                                  onChange={(e) => handleUpdateSetItem(index, { height: parseFloat(e.target.value) || 0 })}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 text-[13px] text-[#12100e] shadow-inner"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-wider font-bold text-[#12100e]/70 block">
                                  Width (mm)
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00"
                                  value={item.width ?? ''}
                                  onChange={(e) => handleUpdateSetItem(index, { width: parseFloat(e.target.value) || 0 })}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 text-[13px] text-[#12100e] shadow-inner"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Diamonds Configuration */}
                          {item.includeDiamond !== false && (
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                              <h4 className="text-[11px] uppercase tracking-[0.25em] font-black text-brand-gold flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5" />
                                2. Diamond Specifications
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase tracking-wider font-bold text-[#12100e]/70 block">
                                    Total Diamond Weight (ct)
                                  </label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={item.diamond_weight ?? ''}
                                    onChange={(e) => handleUpdateSetItem(index, { diamond_weight: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 text-[13px] font-bold text-[#12100e] shadow-inner"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase tracking-wider font-bold text-[#12100e]/70 block">
                                    Total Diamond Pieces
                                  </label>
                                  <input
                                    type="number"
                                    placeholder="0"
                                    value={item.diamond_count ?? ''}
                                    onChange={(e) => handleUpdateSetItem(index, { diamond_count: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 text-[13px] font-bold text-[#12100e] shadow-inner"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase tracking-wider font-bold text-[#12100e]/70 block">
                                    Diamond Quality
                                  </label>
                                  <select
                                    value={item.diamond_quality || 'IJ-SI'}
                                    onChange={(e) => handleUpdateSetItem(index, { diamond_quality: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 text-[13px] font-bold text-[#12100e] shadow-inner"
                                  >
                                    {DIAMOND_QUALITIES.map(q => (
                                      <option key={q.id} value={q.name}>{q.name}</option>
                                    ))}
                                  </select>
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase tracking-wider font-bold text-[#12100e]/70 block">
                                    Diamond Rate (₹/ct, optional)
                                  </label>
                                  <input
                                    type="number"
                                    placeholder="Use live rate"
                                    value={item.diamond_rate ?? ''}
                                    onChange={(e) => handleUpdateSetItem(index, { diamond_rate: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 text-[13px] text-[#12100e] shadow-inner"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase tracking-wider font-bold text-[#12100e]/70 block">
                                    Setting Type
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Prong, Bezel, Pave..."
                                    value={item.diamond_setting || ''}
                                    onChange={(e) => handleUpdateSetItem(index, { diamond_setting: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 text-[13px] text-[#12100e] shadow-inner"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Solitaires Configuration */}
                          {item.includeSolitaire && (
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                              <h4 className="text-[11px] uppercase tracking-[0.25em] font-black text-brand-gold flex items-center gap-2">
                                <Gem className="w-3.5 h-3.5" />
                                3. Solitaire Specifications
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase tracking-wider font-bold text-[#12100e]/70 block">
                                    Solitaire Weight (ct)
                                  </label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={item.solitaire_weight ?? ''}
                                    onChange={(e) => handleUpdateSetItem(index, { solitaire_weight: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 text-[13px] font-bold text-[#12100e] shadow-inner"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase tracking-wider font-bold text-[#12100e]/70 block">
                                    Solitaire Quality
                                  </label>
                                  <select
                                    value={item.solitaire_quality || 'IJ-SI'}
                                    onChange={(e) => handleUpdateSetItem(index, { solitaire_quality: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 text-[13px] font-bold text-[#12100e] shadow-inner"
                                  >
                                    {SOLITAIRE_QUALITIES.map(q => (
                                      <option key={q.id} value={q.name}>{q.name}</option>
                                    ))}
                                  </select>
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase tracking-wider font-bold text-[#12100e]/70 block">
                                    Solitaire Total Price (₹)
                                  </label>
                                  <input
                                    type="number"
                                    value={item.solitaire_price ?? ''}
                                    onChange={(e) => handleUpdateSetItem(index, { solitaire_price: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 text-[13px] font-bold text-[#12100e] shadow-inner"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase tracking-wider font-bold text-[#12100e]/70 block">
                                    Solitaire Setting
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="Prong Setting"
                                    value={item.solitaire_setting || ''}
                                    onChange={(e) => handleUpdateSetItem(index, { solitaire_setting: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 text-[13px] text-[#12100e] shadow-inner"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Gemstones Configuration */}
                          {item.includeGemstone && (
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                              <h4 className="text-[11px] uppercase tracking-[0.25em] font-black text-brand-gold">
                                4. Gemstone Specifications
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase tracking-wider font-bold text-[#12100e]/70 block">
                                    Gemstone Name / Info
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Natural Ruby, Emerald"
                                    value={item.gemstone_info || ''}
                                    onChange={(e) => handleUpdateSetItem(index, { gemstone_info: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 text-[13px] text-[#12100e] shadow-inner"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase tracking-wider font-bold text-[#12100e]/70 block">
                                    Gemstone Weight (ct)
                                  </label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={item.gemstone_weight ?? ''}
                                    onChange={(e) => handleUpdateSetItem(index, { gemstone_weight: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 text-[13px] font-bold text-[#12100e] shadow-inner"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase tracking-wider font-bold text-[#12100e]/70 block">
                                    Number of Gems
                                  </label>
                                  <input
                                    type="number"
                                    value={item.noof_gem ?? ''}
                                    onChange={(e) => handleUpdateSetItem(index, { noof_gem: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 text-[13px] text-[#12100e] shadow-inner"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase tracking-wider font-bold text-[#12100e]/70 block">
                                    Total Gemstone Price (₹)
                                  </label>
                                  <input
                                    type="number"
                                    value={item.gemstone_price ?? ''}
                                    onChange={(e) => handleUpdateSetItem(index, { gemstone_price: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 text-[13px] font-bold text-[#12100e] shadow-inner"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Color Stones Configuration */}
                          {item.includeColorStone && (
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                              <h4 className="text-[11px] uppercase tracking-[0.25em] font-black text-brand-gold">
                                5. Color Stone Specifications
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase tracking-wider font-bold text-[#12100e]/70 block">
                                    Stone Name / Info
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Blue Topaz, Tourmaline"
                                    value={item.color_stone || ''}
                                    onChange={(e) => handleUpdateSetItem(index, { color_stone: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 text-[13px] text-[#12100e] shadow-inner"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase tracking-wider font-bold text-[#12100e]/70 block">
                                    Stone Weight (ct)
                                  </label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={item.color_stone_weight ?? ''}
                                    onChange={(e) => handleUpdateSetItem(index, { color_stone_weight: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 text-[13px] font-bold text-[#12100e] shadow-inner"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase tracking-wider font-bold text-[#12100e]/70 block">
                                    Stone Count
                                  </label>
                                  <input
                                    type="number"
                                    value={item.color_stone_count ?? ''}
                                    onChange={(e) => handleUpdateSetItem(index, { color_stone_count: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 text-[13px] text-[#12100e] shadow-inner"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase tracking-wider font-bold text-[#12100e]/70 block">
                                    Total Stone Price (₹)
                                  </label>
                                  <input
                                    type="number"
                                    value={item.color_stone_price ?? ''}
                                    onChange={(e) => handleUpdateSetItem(index, { color_stone_price: parseFloat(e.target.value) || 0 })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 text-[13px] font-bold text-[#12100e] shadow-inner"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Making Charges for this piece */}
                          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <span className="text-[11px] font-bold text-[#12100e] uppercase tracking-wider block">
                                Making Charges for {item.name} (%)
                              </span>
                              <span className="text-[12px] text-[#12100e]/60 block">
                                Defaults to overall product making charge ({formData.making_charges || 15}%), or set a piece-specific percentage.
                              </span>
                            </div>
                            <div className="w-36 shrink-0">
                              <input
                                type="number"
                                placeholder={String(formData.making_charges || 15)}
                                value={item.making_charges ?? ''}
                                onChange={(e) => handleUpdateSetItem(index, { making_charges: parseFloat(e.target.value) || 0 })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 px-4 text-[13px] font-bold text-[#12100e] shadow-inner"
                              />
                            </div>
                          </div>

                          {/* LIVE INDIVIDUAL PRICE BREAKDOWN FOR THIS PIECE */}
                          <div className="bg-gradient-to-br from-[#5d463c]/5 to-[#5d463c]/10 border-2 border-[#5d463c]/20 rounded-3xl p-6 sm:p-8 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#5d463c]/15 pb-3">
                              <div className="flex items-center gap-2">
                                <Coins className="w-4 h-4 text-[#5d463c]" />
                                <h5 className="text-[13px] font-bold text-[#12100e] uppercase tracking-wider">
                                  {item.name} — Live Price Calculation Breakup
                                </h5>
                              </div>
                              <span className="text-[12px] text-[#5d463c] font-bold">
                                Net Gold Wt: {breakup.net_gold_weight}g
                              </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-[12px]">
                              <div className="bg-white/80 p-3 rounded-2xl border border-slate-200 shadow-xs">
                                <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Gold ({item.karat || '14K'})</span>
                                <span className="font-bold text-[#12100e] text-[14px] mt-0.5 block">
                                  ₹{Math.round(breakup.gold_cost).toLocaleString('en-IN')}
                                </span>
                              </div>

                              <div className="bg-white/80 p-3 rounded-2xl border border-slate-200 shadow-xs">
                                <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Diamonds</span>
                                <span className="font-bold text-[#12100e] text-[14px] mt-0.5 block">
                                  ₹{Math.round(breakup.diamond_cost).toLocaleString('en-IN')}
                                </span>
                              </div>

                              <div className="bg-white/80 p-3 rounded-2xl border border-slate-200 shadow-xs">
                                <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Solitaires & Gems</span>
                                <span className="font-bold text-[#12100e] text-[14px] mt-0.5 block">
                                  ₹{Math.round((breakup.solitaire_cost || 0) + (breakup.gemstone_cost || 0) + (breakup.color_stone_cost || 0)).toLocaleString('en-IN')}
                                </span>
                              </div>

                              <div className="bg-white/80 p-3 rounded-2xl border border-slate-200 shadow-xs">
                                <span className="text-[10px] uppercase tracking-wider text-slate-500 block">Making ({item.making_charges ?? formData.making_charges ?? 15}%)</span>
                                <span className="font-bold text-[#12100e] text-[14px] mt-0.5 block">
                                  ₹{Math.round(breakup.making_charges).toLocaleString('en-IN')}
                                </span>
                              </div>

                              <div className="bg-white/80 p-3 rounded-2xl border border-slate-200 shadow-xs">
                                <span className="text-[10px] uppercase tracking-wider text-slate-500 block">GST (3%)</span>
                                <span className="font-bold text-[#12100e] text-[14px] mt-0.5 block">
                                  ₹{Math.round(breakup.gst).toLocaleString('en-IN')}
                                </span>
                              </div>

                              <div className="bg-[#5d463c] text-white p-3 rounded-2xl shadow-sm">
                                <span className="text-[10px] uppercase tracking-wider text-white/70 block">Item Total</span>
                                <span className="font-bold text-[15px] mt-0.5 block font-serif">
                                  ₹{Math.round(breakup.total).toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-[40px] p-10 space-y-12 shadow-sm">
              <div className="space-y-6">
              <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold block">Jewellery Weights & Specifications</label>

              {/* Dynamic Feature Inclusion Toggles */}
              <div className="bg-[#5d463c]/5 border border-[#5d463c]/15 rounded-3xl p-6 flex flex-wrap gap-8 justify-around">
                <label className="flex items-center space-x-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeMetal}
                    onChange={(e) => setIncludeMetal(e.target.checked)}
                    className="w-5 h-5 accent-[#5d463c] rounded"
                  />
                  <span className="text-[12px] uppercase tracking-wider font-bold text-[#12100e]">Includes Gold</span>
                </label>

                {formData.product_type !== 'gold' && (
                  <label className="flex items-center space-x-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includeDiamond}
                      onChange={(e) => setIncludeDiamond(e.target.checked)}
                      className="w-5 h-5 accent-[#5d463c] rounded"
                    />
                    <span className="text-[12px] uppercase tracking-wider font-bold text-[#12100e]">Includes Diamonds</span>
                  </label>
                )}

                <label className="flex items-center space-x-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeSolitaire}
                    onChange={(e) => setIncludeSolitaire(e.target.checked)}
                    className="w-5 h-5 accent-[#5d463c] rounded"
                  />
                  <span className="text-[12px] uppercase tracking-wider font-bold text-[#12100e]">Includes Solitaires</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeGemstone}
                    onChange={(e) => setIncludeGemstone(e.target.checked)}
                    className="w-5 h-5 accent-[#5d463c] rounded"
                  />
                  <span className="text-[12px] uppercase tracking-wider font-bold text-[#12100e]">Includes Gemstones</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeColorStone}
                    onChange={(e) => setIncludeColorStone(e.target.checked)}
                    className="w-5 h-5 accent-[#5d463c] rounded"
                  />
                  <span className="text-[12px] uppercase tracking-wider font-bold text-[#12100e]">Includes Color Stones</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Core Specifications */}
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Product Weight *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.product_weight || ''}
                    onChange={(e) => setFormData({ ...formData, product_weight: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e]"
                  />
                </div>
                {includeMetal && (
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">{getMetalWeightLabel()}</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.gold_weight || ''}
                      onChange={(e) => setFormData({ ...formData, gold_weight: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e]"
                    />
                  </div>
                )}
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Height (mm) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.height || ''}
                    onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e]"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Width (mm) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.width || ''}
                    onChange={(e) => setFormData({ ...formData, width: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e]"
                  />
                </div>

                {/* Conditional Diamond Requirements */}
                {includeDiamond && (
                  <div className="space-y-6 pt-6 border-t border-slate-200/60 col-span-1 md:col-span-3">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-gold">Diamond Requirements</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Diamond Weight *</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.diamond_weight || ''}
                          onChange={(e) => setFormData({ ...formData, diamond_weight: parseFloat(e.target.value) || 0 })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e]"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Diamond Count *</label>
                        <input
                          type="number"
                          value={formData.diamond_count || ''}
                          onChange={(e) => setFormData({ ...formData, diamond_count: parseInt(e.target.value) || 0 })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Conditional Solitaire Requirements */}
                {includeSolitaire && (
                  <div className="space-y-6 pt-6 border-t border-slate-200/60 col-span-1 md:col-span-3">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-gold">Solitaire Requirements</h4>
                    <div className="grid grid-cols-1 gap-8">
                      <div className="space-y-3 md:w-1/2">
                        <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Solitaire Weight (ct) *</label>
                        <input
                          type="number"
                          step="any"
                          value={formData.solitaires_weight || formData.solitaire_weight || ''}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setFormData({ ...formData, solitaires_weight: val, solitaire_weight: val });
                          }}
                          placeholder="e.g. 0.50"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e]"
                        />
                      </div>

                      <div className="space-y-3 md:w-1/2">
                        <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Solitaire Setting *</label>
                        <input
                          type="text"
                          value={formData.solitaire_setting || formData.solitaires_setting || ''}
                          onChange={(e) => setFormData({ ...formData, solitaire_setting: e.target.value, solitaires_setting: e.target.value })}
                          placeholder="e.g. Prong Setting, Bezel Setting, Pave Setting"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e]"
                        />
                      </div>

                      {/* Select Solitaire Quality & Add Price for Each */}
                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">
                            Select Solitaire Quality & Particular Price (₹) *
                          </label>
                          <span className="text-[10px] text-slate-400 font-medium italic">
                            Select active solitaire qualities and enter their individual price
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                          {SOLITAIRE_QUALITIES.map(sq => {
                            const isChecked = activeSolitaireQualities.includes(sq.id) || activeSolitaireQualities.includes(sq.name);
                            const qualityPrice = (formData[sq.key as keyof ProductFormData] as number) || 0;

                            return (
                              <div
                                key={sq.id}
                                className={cn(
                                  'flex flex-col justify-between p-4 rounded-2xl border text-left transition-all duration-300 space-y-3',
                                  isChecked
                                    ? 'bg-white border-[#5d463c] shadow-md ring-2 ring-[#5d463c]/30'
                                    : 'bg-slate-50 border-slate-200 opacity-70 hover:opacity-100'
                                )}
                              >
                                <div
                                  onClick={() => handleSolitaireQualityToggle(sq.id, sq.name)}
                                  className="w-full flex items-center justify-between cursor-pointer select-none"
                                >
                                  <span className="text-[13px] font-extrabold uppercase tracking-wider text-[#5d463c]">{sq.name}</span>
                                  <span className={cn(
                                    'w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-black',
                                    isChecked ? 'bg-[#5d463c] text-white border-[#5d463c]' : 'border-slate-300 bg-white'
                                  )}>
                                    {isChecked ? '✓' : ''}
                                  </span>
                                </div>

                                <div className="w-full border-t border-slate-100 pt-3 space-y-2">
                                  <label className="text-[9px] uppercase tracking-wider font-bold text-slate-500 block">
                                    Solitaire Price (₹)
                                  </label>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                                    <input
                                      type="number"
                                      min="0"
                                      step="500"
                                      placeholder="e.g. 25000"
                                      value={qualityPrice || ''}
                                      onChange={(e) => {
                                        const val = parseFloat(e.target.value) || 0;
                                        setFormData({
                                          ...formData,
                                          [sq.key]: val,
                                          solitaires_price: val > 0 ? val : formData.solitaires_price
                                        });
                                      }}
                                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-7 pr-3 text-[13px] font-bold text-[#12100e] focus:bg-white focus:border-[#5d463c] transition-all"
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {/* Custom / Manually Added Solitaire Purities */}
                          {(() => {
                            const standardKeys = ['1', '2', '3', '4', 'IJ-SI', 'GH-VS', 'EF-VVS', 'FG-SI'];
                            const customPurityKeys = Array.from(new Set([
                              ...Object.keys(formData.custom_solitaire_prices || {}),
                              ...activeSolitaireQualities.filter(q => !standardKeys.includes(q))
                            ]));

                            return customPurityKeys.map(purityName => {
                              const isChecked = activeSolitaireQualities.includes(purityName);
                              const qualityPrice = (formData.custom_solitaire_prices || {})[purityName] || 0;

                              const toggleCustomPurity = () => {
                                let newQualities: string[];
                                if (isChecked) {
                                  newQualities = activeSolitaireQualities.filter(q => q !== purityName);
                                } else {
                                  newQualities = [...activeSolitaireQualities, purityName];
                                }
                                setFormData({ ...formData, solitaires_quality: newQualities.join(',') });
                              };

                              return (
                                <div
                                  key={purityName}
                                  className={cn(
                                    'flex flex-col justify-between p-4 rounded-2xl border text-left transition-all duration-300 space-y-3 relative group',
                                    isChecked
                                      ? 'bg-white border-[#5d463c] shadow-md ring-2 ring-[#5d463c]/30'
                                      : 'bg-slate-50 border-slate-200 opacity-70 hover:opacity-100'
                                  )}
                                >
                                  <div className="w-full flex items-center justify-between">
                                    <div
                                      onClick={toggleCustomPurity}
                                      className="flex items-center space-x-2 cursor-pointer select-none flex-1"
                                    >
                                      <span className="text-[13px] font-extrabold uppercase tracking-wider text-[#5d463c]">
                                        {purityName}
                                      </span>
                                      <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                                        Manual
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <div
                                        onClick={toggleCustomPurity}
                                        className={cn(
                                          'w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-black cursor-pointer',
                                          isChecked ? 'bg-[#5d463c] text-white border-[#5d463c]' : 'border-slate-300 bg-white'
                                        )}
                                      >
                                        {isChecked ? '✓' : ''}
                                      </div>
                                      <button
                                        type="button"
                                        title="Remove Purity"
                                        onClick={() => handleRemoveCustomSolitairePurity(purityName)}
                                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="w-full border-t border-slate-100 pt-3 space-y-2">
                                    <label className="text-[9px] uppercase tracking-wider font-bold text-slate-500 block">
                                      Solitaire Price (₹)
                                    </label>
                                    <div className="relative">
                                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                                      <input
                                        type="number"
                                        min="0"
                                        step="500"
                                        placeholder="e.g. 25000"
                                        value={qualityPrice || ''}
                                        onChange={(e) => {
                                          const val = parseFloat(e.target.value) || 0;
                                          const newMap = { ...(formData.custom_solitaire_prices || {}) };
                                          newMap[purityName] = val;
                                          setFormData({
                                            ...formData,
                                            custom_solitaire_prices: newMap,
                                            solitaires_price: val > 0 ? val : formData.solitaires_price
                                          });
                                        }}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-7 pr-3 text-[13px] font-bold text-[#12100e] focus:bg-white focus:border-[#5d463c] transition-all"
                                      />
                                    </div>
                                  </div>
                                </div>
                              );
                            });
                          })()}
                        </div>

                        {/* Add Manual Solitaire Purity Form */}
                        <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-5 space-y-3 mt-4">
                          <label className="text-[10px] uppercase tracking-[0.25em] font-black text-[#5d463c] block">
                            + Add Manual Solitaire Purity / Quality
                          </label>
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <input
                              type="text"
                              placeholder="Purity Name (e.g. VVS1, FL, SI1, D-VVS1)"
                              value={customPurityInput}
                              onChange={(e) => setCustomPurityInput(e.target.value)}
                              className="flex-1 bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-[13px] text-[#12100e] focus:ring-1 focus:ring-[#5d463c]/50 focus:border-[#5d463c] transition-all shadow-sm"
                            />
                            <div className="relative w-full sm:w-48">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                              <input
                                type="number"
                                min="0"
                                step="500"
                                placeholder="Price (e.g. 35000)"
                                value={customPurityPriceInput}
                                onChange={(e) => setCustomPurityPriceInput(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-7 pr-3 text-[13px] font-bold text-[#12100e] focus:ring-1 focus:ring-[#5d463c]/50 focus:border-[#5d463c] transition-all shadow-sm"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={handleAddCustomSolitairePurity}
                              disabled={!customPurityInput.trim()}
                              className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-[#5d463c] hover:bg-[#4c3931] text-[#efe7e5] rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all disabled:opacity-40 shadow-sm cursor-pointer"
                            >
                              <Plus size={14} />
                              <span>Add Purity</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Conditional Gemstone Requirements */}
                {includeGemstone && (
                  <div className="space-y-6 pt-6 border-t border-slate-200/60 col-span-1 md:col-span-3">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-gold">Gemstone Requirements</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Gemstone Info</label>
                        <input
                          type="text"
                          value={formData.gemstone_info ?? ''}
                          onChange={(e) => setFormData({ ...formData, gemstone_info: e.target.value || null })}
                          placeholder="e.g. Blue Sapphire, Tanzanite"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e]"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Gemstone Weight (ct)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.gemstone_weight || ''}
                          onChange={(e) => setFormData({ ...formData, gemstone_weight: parseFloat(e.target.value) || 0 })}
                          placeholder="e.g. 0.85"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e]"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Total Number Of GEM *</label>
                        <input
                          type="number"
                          value={formData.noof_gem || ''}
                          onChange={(e) => setFormData({ ...formData, noof_gem: parseInt(e.target.value) || 0 })}
                          placeholder="e.g. 2"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e]"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Gemstone Price (₹) *</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                          <input
                            type="number"
                            step="500"
                            value={formData.gemstone_price || ''}
                            onChange={(e) => setFormData({ ...formData, gemstone_price: parseFloat(e.target.value) || 0 })}
                            placeholder="e.g. 15000"
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-8 pr-6 text-[13px] font-bold text-[#12100e]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Conditional Color Stone Requirements */}
                {includeColorStone && (
                  <div className="space-y-6 pt-6 border-t border-slate-200/60 col-span-1 md:col-span-3">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-gold">Color Stone Requirements</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Color Stone Info</label>
                        <input
                          type="text"
                          value={formData.color_stone ?? ''}
                          onChange={(e) => setFormData({ ...formData, color_stone: e.target.value || null })}
                          placeholder="e.g. Ruby, Emerald"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e]"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Color Stone Weight (ct)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.color_stone_weight || ''}
                          onChange={(e) => setFormData({ ...formData, color_stone_weight: parseFloat(e.target.value) || 0 })}
                          placeholder="e.g. 0.50"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e]"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Color Stone Count</label>
                        <input
                          type="number"
                          value={formData.color_stone_count || ''}
                          onChange={(e) => setFormData({ ...formData, color_stone_count: parseInt(e.target.value) || 0 })}
                          placeholder="e.g. 4"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-6 text-[13px] text-[#12100e]"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Color Stone Price (₹)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                          <input
                            type="number"
                            step="500"
                            value={formData.color_stone_price || ''}
                            onChange={(e) => setFormData({ ...formData, color_stone_price: parseFloat(e.target.value) || 0 })}
                            placeholder="e.g. 12000"
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-8 pr-6 text-[13px] font-bold text-[#12100e]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3 col-span-1 md:col-span-3 pt-6 border-t border-slate-200/80">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Select Karat *</label>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {KARATS.map(karat => {
                      const isChecked = activeKarats.includes(karat.id);
                      return (
                        <button
                          key={karat.id}
                          type="button"
                          onClick={() => handleKaratToggle(karat.id)}
                          className={cn(
                            'flex items-center justify-center px-6 py-3 rounded-xl border text-center transition-all duration-300 cursor-pointer text-[12px] font-bold uppercase tracking-wider',
                            isChecked
                              ? 'bg-[#5d463c] text-[#efe7e5] border-[#5d463c]'
                              : 'bg-slate-50 border border-slate-200 text-[#12100e]/60'
                          )}
                        >
                          {karat.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          )
        )}

        {activeTab === 'attributes' && (
          <div className="bg-white border border-slate-200/80 rounded-[40px] p-10 space-y-12 shadow-sm">

            {/* Category Configuration */}
            <div className="space-y-6">
              <h3 className="text-lg font-serif font-bold text-[#12100e]">Collection Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Category</label>
                  <input
                    type="text"
                    placeholder="Enter Category Name"
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] text-[#12100e]"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-black text-brand-gold ml-2 block">Subcategory</label>
                  <input
                    type="text"
                    placeholder="Enter Subcategory Name"
                    value={formData.subcategory_id}
                    onChange={(e) => setFormData({ ...formData, subcategory_id: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-[14px] text-[#12100e]"
                  />
                </div>
              </div>
            </div>

            {/* Configurable Metal Selection */}
            <div className="space-y-6 pt-10 border-t border-slate-200/80">
              <h3 className="text-lg font-serif font-bold text-[#12100e]">Active Metals</h3>
              <p className="text-[11px] text-[#12100e]/70 leading-relaxed uppercase tracking-widest">
                Selecting metal options generates corresponding image uploader sections in the Media tab.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {METAL_TYPES.map(metal => {
                  const isChecked = activeMetals.includes(metal.id);
                  return (
                    <button
                      key={metal.id}
                      onClick={() => handleMetalToggle(metal.id)}
                      className={cn(
                        'flex items-center justify-center p-4 rounded-2xl border text-center transition-all duration-300 cursor-pointer',
                        isChecked
                          ? 'bg-[#5d463c]/15 border-[#5d463c] text-[#5d463c] font-bold'
                          : 'bg-slate-50 border border-slate-200 text-[#12100e]/60'
                      )}
                    >
                      <span className="text-[12px] uppercase tracking-wider">{metal.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Purity Configuration */}
            <div className="space-y-6 pt-10 border-t border-slate-200/80">
              <h3 className="text-lg font-serif font-bold text-[#12100e]">Available Gold Purities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {KARATS.map(karat => {
                  const isChecked = activeKarats.includes(karat.id);
                  return (
                    <button
                      key={karat.id}
                      onClick={() => handleKaratToggle(karat.id)}
                      className={cn(
                        'flex items-center justify-center p-4 rounded-2xl border text-center transition-all duration-300 cursor-pointer',
                        isChecked
                          ? 'bg-[#5d463c]/15 border-[#5d463c] text-[#5d463c] font-bold'
                          : 'bg-slate-50 border border-slate-200 text-[#12100e]/60'
                      )}
                    >
                      <span className="text-[12px] uppercase tracking-wider">{karat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Diamond Quality Configuration */}
            <div className="space-y-6 pt-10 border-t border-slate-200/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#12100e]">Diamond Qualities & Prices</h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Select active diamond qualities for this product. Rates are automatically benchmarked from Daily Pricing.
                  </p>
                </div>
                <span className="text-[9px] uppercase tracking-widest text-[#5d463c] font-bold">
                  {activeDiamondQualities.length} Selected
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Preset Diamond Qualities */}
                {DIAMOND_QUALITIES.map(dq => {
                  const isChecked = activeDiamondQualities.includes(dq.id) || activeDiamondQualities.includes(dq.name);
                  const dailyRateKey = dq.rateKey;
                  const dailyRate = dailyRates ? Number(dailyRates[dailyRateKey] || 0) : 0;

                  return (
                    <button
                      key={dq.id}
                      type="button"
                      onClick={() => handleDiamondQualityToggle(dq.id, dq.name)}
                      className={cn(
                        'flex flex-col items-start justify-between p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer space-y-2',
                        isChecked
                          ? 'bg-[#5d463c] text-[#efe7e5] border-[#5d463c] shadow-md'
                          : 'bg-slate-50 border border-slate-200 text-[#12100e]/70 hover:border-slate-300'
                      )}
                    >
                      <div className="w-full flex items-center justify-between">
                        <span className="text-[12px] font-bold uppercase tracking-wider">{dq.name}</span>
                        <span className={cn(
                          'w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-black',
                          isChecked ? 'bg-[#efe7e5] text-[#5d463c] border-[#efe7e5]' : 'border-slate-300 bg-white'
                        )}>
                          {isChecked ? '✓' : ''}
                        </span>
                      </div>
                      <div className="w-full border-t border-current/15 pt-2 text-[11px]">
                        <div className="opacity-75 uppercase text-[9px] tracking-wider font-bold">
                          Daily Benchmark Rate
                        </div>
                        <div className="font-extrabold text-[13px]">
                          {dailyRate > 0 ? `₹${dailyRate.toLocaleString('en-IN')} / ct` : 'No price set'}
                        </div>
                      </div>
                    </button>
                  );
                })}

                {/* Custom Daily Diamond Purities */}
                {(() => {
                  const standardKeys = ['1', '2', '3', '4', 'IJ-SI', 'GH-VS', 'EF-VVS', 'FG-SI'];
                  const customDailyMap = dailyRates?.custom_diamond_rates || {};
                  const customPurityKeys = Array.from(new Set([
                    ...Object.keys(customDailyMap),
                    ...activeDiamondQualities.filter(q => !standardKeys.includes(q))
                  ]));

                  return customPurityKeys.map(purityName => {
                    const isChecked = activeDiamondQualities.includes(purityName);
                    const dailyRate = customDailyMap[purityName] || 0;

                    const toggleCustomPurity = () => {
                      let newQualities: string[];
                      if (isChecked) {
                        newQualities = activeDiamondQualities.filter(q => q !== purityName);
                      } else {
                        newQualities = [...activeDiamondQualities, purityName];
                      }
                      setFormData({ ...formData, diamond_quality: newQualities.join(',') });
                    };

                    return (
                      <button
                        key={purityName}
                        type="button"
                        onClick={toggleCustomPurity}
                        className={cn(
                          'flex flex-col items-start justify-between p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer space-y-2',
                          isChecked
                            ? 'bg-[#5d463c] text-[#efe7e5] border-[#5d463c] shadow-md'
                            : 'bg-slate-50 border border-slate-200 text-[#12100e]/70 hover:border-slate-300'
                        )}
                      >
                        <div className="w-full flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[12px] font-bold uppercase tracking-wider">{purityName}</span>
                            <span className="text-[8px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded-full uppercase">Manual</span>
                          </div>
                          <span className={cn(
                            'w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-black',
                            isChecked ? 'bg-[#efe7e5] text-[#5d463c] border-[#efe7e5]' : 'border-slate-300 bg-white'
                          )}>
                            {isChecked ? '✓' : ''}
                          </span>
                        </div>
                        <div className="w-full border-t border-current/15 pt-2 text-[11px]">
                          <div className="opacity-75 uppercase text-[9px] tracking-wider font-bold">
                            Daily Benchmark Rate
                          </div>
                          <div className="font-extrabold text-[13px]">
                            {dailyRate > 0 ? `₹${Number(dailyRate).toLocaleString('en-IN')} / ct` : 'No price set'}
                          </div>
                        </div>
                      </button>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Size Configurations */}
            {(() => {
              const categoryLower = (formData.category_id || '').toLowerCase();
              const isEarring = categoryLower.includes('earring') || formData.category_id === '6';
              const isRing = !isEarring && (formData.category_id === '1' || categoryLower === 'rings' || categoryLower === 'ring' || (categoryLower.includes('ring') && !categoryLower.includes('nose') && !categoryLower.includes('pendant') && !categoryLower.includes('necklace')));
              const isBangle = formData.category_id === '4' || formData.category_id === '5' || categoryLower === 'bangles' || categoryLower === 'bangle' || categoryLower.includes('bangle');
              const isTennisBracelet = formData.category_id === '8' || categoryLower === 'tennis bracelets' || categoryLower === 'tennis bracelet' || categoryLower === 'bracelets' || categoryLower === 'bracelet' || categoryLower.includes('bracelet');
              const isChain = categoryLower === 'chains' || categoryLower === 'chain' || categoryLower.includes('chain');
              const isMangalsutra = categoryLower === 'mangalsutra' || categoryLower === 'mangalsutras' || categoryLower.includes('mangalsutra');
              const showSizing = isRing || isBangle || isTennisBracelet || isChain || isMangalsutra;

              if (!showSizing) return null;

              const sizesList = isRing
                ? RING_SIZES
                : isBangle
                  ? BANGLE_SIZES
                  : isChain
                    ? CHAIN_SIZES_AANA
                    : isMangalsutra
                      ? MANGALSUTRA_SIZES_AANA
                      : TENNIS_BRACELET_SIZES_AANA;

              const titleLabel = isRing
                ? 'Ring Sizes Whitelist'
                : isBangle
                  ? 'Bangle Sizes Whitelist'
                  : isChain
                    ? 'Chain Lengths Whitelist (Aana / Inches)'
                    : isMangalsutra
                      ? 'Mangalsutra Lengths Whitelist (Aana / Inches)'
                      : 'Tennis Bracelet Lengths Whitelist (Aana / Inches)';

              const isAanaCategory = isChain || isMangalsutra || isTennisBracelet;

              const currentDefaultBangleSize = (formData.banglesize_id && formData.banglesize_id !== '0')
                ? formData.banglesize_id
                : '2.6';

              const handleSetDefaultBangleSize = (newDefaultSize: string) => {
                let updatedSizes = [...activeSizes];
                if (!updatedSizes.includes(newDefaultSize)) {
                  updatedSizes.push(newDefaultSize);
                }
                setFormData({
                  ...formData,
                  banglesize_id: newDefaultSize,
                  size_id: updatedSizes.join(',')
                });
              };

              return (
                <div className="space-y-6 pt-10 border-t border-slate-200/80">
                  {/* Bangle Default Size Configuration Banner */}
                  {isBangle && (
                    <div className="bg-gradient-to-r from-amber-50/80 via-orange-50/40 to-amber-50/80 border border-amber-200/90 rounded-2xl p-5 space-y-4 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-[#5d463c] text-[#efe7e5] text-[10px] font-extrabold uppercase tracking-wider">
                              ★ Base Size
                            </span>
                            <h4 className="text-sm font-serif font-bold text-[#12100e]">
                              Default Bangle Size (Pricing & Weight Basis)
                            </h4>
                          </div>
                          <p className="text-xs text-stone-600 leading-relaxed">
                            The product's base weight (<strong className="text-stone-900 font-semibold">{formData.gold_weight || 0}g</strong>) and base price are calibrated at this default size.
                            Weights and prices for all other sizes will be automatically calculated relative to this size (±0.25g per Aana / 0.5g per 2 Aana).
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 bg-white/90 p-2 rounded-xl border border-amber-200">
                          <label className="text-xs font-bold text-stone-700 whitespace-nowrap">Default Size:</label>
                          <select
                            value={currentDefaultBangleSize}
                            onChange={(e) => handleSetDefaultBangleSize(e.target.value)}
                            className="px-3 py-1.5 bg-white border border-[#5d463c]/30 rounded-lg text-xs font-bold text-[#5d463c] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5d463c]"
                          >
                            {BANGLE_SIZES.map(sz => (
                              <option key={sz} value={sz}>
                                Size {sz} {sz === '2.4' ? '(Small/Medium)' : sz === '2.6' ? '(Standard)' : sz === '2.8' ? '(Large)' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-amber-200/60">
                        <span className="text-[11px] font-semibold text-stone-600 mr-1">Quick Select Default:</span>
                        {['2.2', '2.4', '2.6', '2.8', '2.10', '3.0'].map(sz => {
                          const isCurrent = currentDefaultBangleSize === sz;
                          return (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => handleSetDefaultBangleSize(sz)}
                              className={cn(
                                "px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5",
                                isCurrent
                                  ? "bg-[#5d463c] text-white shadow-sm ring-2 ring-[#5d463c]/40 font-extrabold"
                                  : "bg-white/90 border border-stone-300 text-stone-700 hover:border-[#5d463c] hover:bg-white"
                              )}
                            >
                              {isCurrent && <span>★</span>}
                              <span>{sz}</span>
                              {isCurrent && <span className="text-[9px] opacity-90 font-normal">(Default)</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-[#12100e]">
                        {titleLabel}
                      </h3>
                      {isBangle && (
                        <p className="text-xs text-stone-500 mt-0.5">
                          Select which bangle sizes customers can choose from. Click a size to toggle whitelist, or click the star to make it default.
                        </p>
                      )}
                    </div>
                    <span className="text-[9px] uppercase tracking-widest text-[#5d463c] font-bold">
                      {activeSizes.length} Selected
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
                    {sizesList.map(sz => {
                      const isChecked = activeSizes.includes(sz);
                      const isDefault = isBangle && currentDefaultBangleSize === sz;
                      const displayLabel = isAanaCategory
                        ? `${sz} Aana (${(Number(sz) * 0.0625).toFixed(1).replace(/\.0$/, '')}")`
                        : sz;
                      return (
                        <div key={sz} className="relative group">
                          <button
                            type="button"
                            onClick={() => handleSizeToggle(sz)}
                            className={cn(
                              'w-full flex flex-col items-center justify-center py-3 px-2 rounded-xl border text-center transition-all duration-200 text-[11px] font-bold cursor-pointer relative',
                              isChecked
                                ? isDefault
                                  ? 'bg-[#5d463c] text-[#efe7e5] border-[#5d463c] shadow-md ring-2 ring-amber-400/80'
                                  : 'bg-[#5d463c] text-[#efe7e5] border-[#5d463c] shadow-md'
                                : 'bg-slate-50 border border-slate-200 text-[#12100e]/50 hover:border-[#5d463c]/40'
                            )}
                          >
                            <span>{displayLabel}</span>
                            {isDefault && (
                              <span className="text-[9px] text-amber-300 font-extrabold tracking-wide uppercase mt-0.5 flex items-center gap-0.5">
                                ★ DEFAULT
                              </span>
                            )}
                          </button>
                          {isBangle && !isDefault && (
                            <button
                              type="button"
                              title={`Set ${sz} as default baseline size`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetDefaultBangleSize(sz);
                              }}
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-amber-100 hover:bg-amber-200 text-amber-900 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm cursor-pointer z-10"
                            >
                              Make Default
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>
        )}


      </div>
    </div>
  );
}
