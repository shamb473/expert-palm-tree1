
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Product, User } from '../types';
import { ShoppingCart, Filter, ArrowUpDown, Bell, X, Check, Search, Share2, AlertCircle, Plus, Trash2, Image as ImageIcon, Upload, Factory, Clock, ScanQrCode, Camera, Sparkles, Brain, Loader2, MessageCircle, Eye, EyeOff, Star, Edit } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface ProductsProps {
  products: Product[];
  user: User | null;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  onUpdateProduct?: (product: Product) => void;
  showPesticidePrices?: boolean;
  onTogglePesticidePrices?: () => void;
}

export const Products: React.FC<ProductsProps> = ({ 
  products, 
  user, 
  onAddProduct, 
  onDeleteProduct, 
  onUpdateProduct,
  showPesticidePrices = true,
  onTogglePesticidePrices
}) => {
  // State for Filters and Sort
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [companyFilter, setCompanyFilter] = useState<string>('All');
  const [sortOption, setSortOption] = useState<string>('name');
  const [searchQuery, setSearchQuery] = useState('');

  // State for Alert Logic
  const [alertConfig, setAlertConfig] = useState<{id: number | null, active: boolean}>({ id: null, active: false });
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info' | 'error'} | null>(null);

  // State for Add to Cart animation
  const [addedToCart, setAddedToCart] = useState<number | null>(null);

  // State for Lightbox
  const [lightboxState, setLightboxState] = useState<{productId: number | null, imageIndex: number}>({ productId: null, imageIndex: 0 });

  // Recently Viewed State
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('kastkar_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Admin / Add Product State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: 'Seeds',
    price: 0,
    description: '',
    image: '',
    inStock: true,
    company: '',
    quantity: 10,
    images: []
  });

  // Admin / Edit Product State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Inline Stock Edit State
  const [editStockId, setEditStockId] = useState<number | null>(null);
  const [editStockValue, setEditStockValue] = useState<number>(0);

  // QR Scanner State
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // AI Suitability Check State
  const [isSuitabilityModalOpen, setIsSuitabilityModalOpen] = useState(false);
  const [suitabilityData, setSuitabilityData] = useState<{productName: string, advice: string} | null>(null);
  const [isSuitabilityLoading, setIsSuitabilityLoading] = useState(false);

  // Online Purchase / Cart State
  interface CartItem extends Product {
      cartQuantity: number;
  }
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details'>('cart');
  const [customerDetails, setCustomerDetails] = useState({ name: '', mobile: '', address: '' });

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const companies = ['All', ...Array.from(new Set(products.map(p => p.company).filter(Boolean) as string[]))];

  // Logic to Filter and Sort Products
  const filteredProducts = useMemo(() => {
    let result = products;

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        (p.company && p.company.toLowerCase().includes(query)) ||
        p.id.toString() === query
      );
    }

    // Filter by Category
    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter);
    }

    // Filter by Company
    if (companyFilter !== 'All') {
      result = result.filter(p => p.company === companyFilter);
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortOption === 'price-low') return a.price - b.price;
      if (sortOption === 'price-high') return b.price - a.price;
      if (sortOption === 'availability') return (a.inStock === b.inStock) ? 0 : a.inStock ? -1 : 1;
      if (sortOption === 'company') {
         const companyA = a.company || '';
         const companyB = b.company || '';
         return companyA.localeCompare(companyB);
      }
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [categoryFilter, companyFilter, sortOption, searchQuery, products]);

  // Product of the Day Logic
  const productOfTheDay = useMemo(() => {
    if (products.length === 0) return null;
    const date = new Date();
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const index = dayOfYear % products.length;
    return products[index];
  }, [products]);

  // Derived Recently Viewed Products
  const recentlyViewedProducts = useMemo(() => {
    return recentlyViewedIds
      .map(id => products.find(p => p.id === id))
      .filter((p): p is Product => p !== undefined);
  }, [recentlyViewedIds, products]);

  const addToRecentlyViewed = (productId: number) => {
    setRecentlyViewedIds(prev => {
      const newIds = [productId, ...prev.filter(id => id !== productId)].slice(0, 4);
      try {
        localStorage.setItem('kastkar_recently_viewed', JSON.stringify(newIds));
      } catch (e) {
        console.error("Failed to save recently viewed", e);
      }
      return newIds;
    });
  };

  const handleSetAlert = (product: Product) => {
    const price = parseInt(targetPrice);
    if (!price || isNaN(price)) return;
    setAlertConfig({ id: null, active: false });
    
    if (price >= product.price) {
      setNotification({ message: `Good news! ${product.name} is already available at ₹${product.price}`, type: 'success' });
    } else {
      setNotification({ message: `Alert set for ${product.name} at ₹${price}. We will notify you!`, type: 'info' });
    }
    setTargetPrice('');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddToCart = (product: Product, openCartImmediately = false) => {
    if (!product.inStock) return;
    
    setCart(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
            return prev.map(item => item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item);
        } else {
            return [...prev, { ...product, cartQuantity: 1 }];
        }
    });

    setAddedToCart(product.id);
    if (!openCartImmediately) {
        setNotification({ message: `${product.name} added to cart!`, type: 'success' });
        setTimeout(() => {
            setAddedToCart(null);
            setNotification(null);
        }, 2000);
    } else {
        setIsCartOpen(true);
        setCheckoutStep('cart');
    }
  };

  const updateCartQuantity = (id: number, delta: number) => {
      setCart(prev => prev.map(item => {
          if (item.id === id) {
              const newQty = Math.max(0, item.cartQuantity + delta);
              return { ...item, cartQuantity: newQty };
          }
          return item;
      }).filter(item => item.cartQuantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);

  const handlePlaceOrder = () => {
      if (!customerDetails.name || !customerDetails.mobile || !customerDetails.address) {
          alert("Please fill in all details");
          return;
      }

      let message = `*New Order from Kastkar App*\n\n`;
      message += `*Customer:* ${customerDetails.name}\n`;
      message += `*Mobile:* ${customerDetails.mobile}\n`;
      message += `*Address:* ${customerDetails.address}\n\n`;
      message += `*Order Details:*\n`;
      cart.forEach(item => {
          message += `- ${item.name} x ${item.cartQuantity} = ₹${item.price * item.cartQuantity}\n`;
      });
      message += `\n*Grand Total: ₹${cartTotal}*`;

      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/918999678500?text=${encodedMessage}`, '_blank');
      
      setCart([]);
      setIsCartOpen(false);
      setCustomerDetails({ name: '', mobile: '', address: '' });
      setNotification({ message: 'Order request sent via WhatsApp!', type: 'success' });
      setTimeout(() => setNotification(null), 3000);
  };

  const handleShare = async (product: Product) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} by ${product.company || 'Kastkar'} at Kastkar Krushi Seva Kendra for ₹${product.price}.`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      navigator.clipboard.writeText(`Check out ${product.name} - ₹${product.price}`);
      setNotification({ message: 'Product link copied to clipboard!', type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // --- Rating Handler ---
  const handleRating = (e: React.MouseEvent, product: Product, rating: number) => {
      e.stopPropagation();
      if (!onUpdateProduct) return;

      const currentRatings = product.ratings || [];
      const updatedProduct = {
          ...product,
          ratings: [...currentRatings, rating]
      };
      
      onUpdateProduct(updatedProduct);
      setNotification({ message: `You rated ${product.name} ${rating} stars!`, type: 'success' });
      setTimeout(() => setNotification(null), 2000);
  };

  // Helper to calculate average rating
  const getAverageRating = (ratings?: number[]) => {
      if (!ratings || ratings.length === 0) return '0';
      const sum = ratings.reduce((a, b) => a + b, 0);
      return (sum / ratings.length).toFixed(1);
  };

  // --- Lightbox Handlers ---
  const openLightbox = (productId: number, index: number = 0) => {
    setLightboxState({ productId, imageIndex: index });
  };
  
  const closeLightbox = () => {
    setLightboxState({ productId: null, imageIndex: 0 });
  };

  const nextLightboxImage = (e: React.MouseEvent, images: string[]) => {
    e.stopPropagation();
    setLightboxState(prev => ({ ...prev, imageIndex: (prev.imageIndex + 1) % images.length }));
  };

  const prevLightboxImage = (e: React.MouseEvent, images: string[]) => {
    e.stopPropagation();
    setLightboxState(prev => ({ ...prev, imageIndex: (prev.imageIndex - 1 + images.length) % images.length }));
  };

  // --- Image Upload Handlers (Add Mode) ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Image Upload Handlers (Edit Mode) ---
  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct(prev => prev ? ({ ...prev, image: reader.result as string }) : null);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Add Product Handler ---
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
        setNotification({ message: 'Name and Price are required!', type: 'error' });
        setTimeout(() => setNotification(null), 3000);
        return;
    }

    const quantity = newProduct.quantity !== undefined ? Number(newProduct.quantity) : 10;
    const inStock = quantity > 0;

    const productToAdd: Product = {
        id: Date.now(),
        name: newProduct.name,
        category: newProduct.category || 'Seeds',
        price: Number(newProduct.price),
        description: newProduct.description || 'No description provided.',
        image: newProduct.image || `https://picsum.photos/400/300?random=${Date.now()}`,
        inStock: inStock,
        company: newProduct.company || '',
        quantity: quantity,
        images: newProduct.images || [],
        ratings: []
    };

    onAddProduct(productToAdd);
    setNotification({ message: 'Product added successfully!', type: 'success' });
    setTimeout(() => setNotification(null), 3000);
    setIsAddModalOpen(false);
    setNewProduct({ name: '', category: 'Seeds', price: 0, description: '', image: '', inStock: true, company: '', quantity: 10, images: [] });
  };

  // --- Edit Product Handler ---
  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    if (onUpdateProduct) {
        // Ensure inStock is synced with quantity
        const quantity = editingProduct.quantity !== undefined ? Number(editingProduct.quantity) : 0;
        const updated = {
            ...editingProduct,
            quantity: quantity,
            inStock: quantity > 0
        };
        onUpdateProduct(updated);
        setNotification({ message: 'Product updated successfully!', type: 'success' });
    }
    
    setTimeout(() => setNotification(null), 3000);
    setEditingProduct(null);
  };

  const openEditModal = (e: React.MouseEvent, product: Product) => {
      e.stopPropagation();
      setEditingProduct({ ...product });
  };

  // --- Inline Stock Editing ---
  const startEditingStock = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    setEditStockId(product.id);
    setEditStockValue(product.quantity || 0);
  };

  const cancelEditStock = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditStockId(null);
  };

  const saveStock = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (onUpdateProduct) {
        const newQty = editStockValue < 0 ? 0 : editStockValue;
        onUpdateProduct({
            ...product,
            quantity: newQty,
            inStock: newQty > 0
        });
        setNotification({ message: 'Stock updated!', type: 'success' });
        setTimeout(() => setNotification(null), 2000);
    }
    setEditStockId(null);
  };

  // --- AI Crop Suitability Check ---
  const checkCropSuitability = async (e: React.MouseEvent, product: Product) => {
      e.stopPropagation();
      if (!process.env.API_KEY) {
          setNotification({ message: 'AI API Key missing', type: 'error' });
          setTimeout(() => setNotification(null), 3000);
          return;
      }
      
      setIsSuitabilityLoading(true);
      setIsSuitabilityModalOpen(true);
      setSuitabilityData(null);

      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          
          const prompt = `
          As an agricultural expert for the Vidarbha region (specifically Akola district, Maharashtra), evaluate the suitability of the following product:
          Product: ${product.name}
          Description: ${product.description}
          Recommended Soil Type: ${product.suitableSoil || 'General Agriculture Soil'}
          Current Date: ${new Date().toLocaleDateString()}
          
          Question: Is this a good time to plant/use this product given the typical weather in Akola right now? Is the soil type usually found in this region compatible?
          Provide a concise recommendation (max 3-4 sentences). Start with "Recommended" or "Not Recommended" or "Use with Caution".
          `;

          const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
          });
          const response = result.text || "";
          
          setSuitabilityData({
              productName: product.name,
              advice: response
          });
      } catch (error) {
          console.error("AI Error", error);
          setSuitabilityData({
              productName: product.name,
              advice: "Unable to connect to AI service. Please verify manually or try again."
          });
      } finally {
          setIsSuitabilityLoading(false);
      }
  };

  // --- QR Scanner ---
  const startCamera = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setCameraStream(stream);
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    } catch (err) {
        console.error("Error accessing camera:", err);
        setNotification({ message: 'Camera access denied or unavailable', type: 'error' });
        setTimeout(() => setNotification(null), 3000);
        setIsScannerOpen(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
    }
  };

  useEffect(() => {
    if (isScannerOpen) {
        startCamera();
    } else {
        stopCamera();
    }
    return () => stopCamera();
  }, [isScannerOpen]);

  const handleScanResult = (result: string) => {
      const existingProduct = products.find(p => 
        p.id.toString() === result || 
        p.name.toLowerCase() === result.toLowerCase()
      );

      if (existingProduct) {
          setSearchQuery(existingProduct.name);
          setNotification({ message: 'Product found!', type: 'success' });
          setIsScannerOpen(false);
      } else {
          if (window.confirm(`Product with code "${result}" not found. Would you like to add it?`)) {
              setIsScannerOpen(false);
              setNewProduct(prev => ({ ...prev, name: result }));
              setIsAddModalOpen(true);
          } else {
              setNotification({ message: 'Product not found', type: 'info' });
          }
      }
      setTimeout(() => setNotification(null), 3000);
  };

  // Helper to render visual stock indicator
  const renderStockIndicator = (product: Product) => {
    const isEditing = editStockId === product.id;
    
    if (isEditing) {
        return (
            <div className="mt-2 mb-2 bg-slate-50 p-2 rounded-lg border border-slate-200" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-600">Qty:</span>
                    <input 
                        type="number" 
                        value={editStockValue}
                        onChange={(e) => setEditStockValue(parseInt(e.target.value) || 0)}
                        className="w-16 px-1 py-0.5 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-green-500 outline-none"
                        autoFocus
                    />
                    <button onClick={(e) => saveStock(e, product)} className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200">
                        <Check size={12} />
                    </button>
                    <button onClick={cancelEditStock} className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200">
                        <X size={12} />
                    </button>
                </div>
            </div>
        );
    }

    const quantity = product.quantity !== undefined ? product.quantity : (product.inStock ? 50 : 0);
    const isOut = !product.inStock || quantity === 0;
    const isLow = !isOut && quantity < 10;
    const maxDisplay = 20; 
    const widthPct = Math.min((quantity / maxDisplay) * 100, 100);

    let label = 'Available';
    let textColor = 'text-emerald-700';
    if (isOut) {
        label = 'Sold Out';
        textColor = 'text-slate-500';
    } else if (isLow) {
        label = 'Low Stock';
        textColor = 'text-orange-600';
    }

    return (
        <div className="mt-auto mb-2">
             <div className="flex items-center justify-between text-[10px] mb-1">
                <span className={`font-bold flex items-center gap-1 ${textColor}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isOut ? 'bg-slate-400' : isLow ? 'bg-orange-500' : 'bg-emerald-500'}`}></span>
                    {label}
                </span>
                <div className="flex items-center gap-1">
                    {!isOut && isLow && (
                        <span className="text-orange-600 font-medium">{quantity} left</span>
                    )}
                    {user && (
                         <button 
                            onClick={(e) => startEditingStock(e, product)}
                            className="text-slate-400 hover:text-green-600 transition-colors"
                            title="Edit Stock"
                         >
                            <Factory size={10} />
                         </button>
                    )}
                </div>
             </div>
             <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-500 ease-out ${isOut ? 'bg-slate-300' : isLow ? 'bg-orange-500' : 'bg-emerald-500'}`} 
                    style={{ width: isOut ? '0%' : `${widthPct}%` }}
                />
             </div>
        </div>
    );
  };

  const isPriceVisible = (product: Product) => {
      // If user is owner, always show price
      if (user) return true;
      // If pesticide prices are hidden and product is pesticide, hide
      if (!showPesticidePrices && product.category === 'Pesticides') return false;
      // Default show
      return true;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      
      {/* Product of the Day Banner - Compact */}
      {productOfTheDay && !searchQuery && categoryFilter === 'All' && companyFilter === 'All' && (
        <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-3 md:p-4 border border-yellow-100 shadow-md relative overflow-hidden flex items-center gap-4">
            {/* Banner Content */}
             <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center shadow-sm z-10">
                <Sparkles size={10} className="mr-1" />
                Deal of the Day
            </div>
            
            <div className="w-28 h-28 md:w-32 md:h-32 bg-white rounded-xl shadow-sm overflow-hidden relative group cursor-pointer shrink-0" onClick={() => openLightbox(productOfTheDay.id)}>
                <img 
                    src={productOfTheDay.image} 
                    alt={productOfTheDay.name} 
                    className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            <div className="w-full flex flex-col items-start text-left min-w-0">
                    <h2 className="text-lg md:text-xl font-extrabold text-slate-800 mb-0.5 line-clamp-1">{productOfTheDay.name}</h2>
                    {productOfTheDay.company && (
                    <div className="flex items-center text-orange-600 font-bold text-[10px] mb-1.5">
                        <Factory size={10} className="mr-1" />
                        {productOfTheDay.company}
                    </div>
                    )}
                    <div className="flex items-center gap-1 mb-1.5">
                        <span className="bg-yellow-100 text-yellow-800 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1">
                            <Star size={8} className="fill-yellow-600 text-yellow-600" />
                            {getAverageRating(productOfTheDay.ratings)}
                        </span>
                        <span className="text-[9px] text-slate-500">({productOfTheDay.ratings?.length || 0} reviews)</span>
                    </div>
                    <p className="text-slate-600 text-xs mb-3 line-clamp-2 leading-relaxed">{productOfTheDay.description}</p>
                    
                    <div className="mt-auto flex items-center gap-3 w-full">
                        {isPriceVisible(productOfTheDay) ? (
                            <span className="text-xl font-bold text-green-700">₹{productOfTheDay.price}</span>
                        ) : (
                            <span className="text-sm font-bold text-slate-500">Call for Price</span>
                        )}
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(productOfTheDay, true); // Open cart immediately
                            }}
                            disabled={!productOfTheDay.inStock}
                            className={`px-4 py-2 rounded-lg font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 ml-auto ${
                                !productOfTheDay.inStock 
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : 'bg-green-700 text-white hover:bg-green-800'
                            }`}
                        >
                            <ShoppingCart size={14} />
                            Buy Now
                        </button>
                    </div>
            </div>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Products</h2>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full md:w-auto items-center">
          {user && (
            <div className="flex items-center gap-2">
                <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center space-x-1 bg-green-700 hover:bg-green-800 text-white px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm text-xs"
                >
                <Plus size={16} />
                <span className="hidden sm:inline">Add</span>
                </button>
                <button
                onClick={() => setIsScannerOpen(true)}
                className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm text-xs"
                title="Scan QR Code"
                >
                <ScanQrCode size={16} />
                <span className="hidden sm:inline">Scan</span>
                </button>
                
                {/* Toggle Pesticide Prices Button */}
                {onTogglePesticidePrices && (
                    <button 
                        onClick={onTogglePesticidePrices}
                        className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm text-xs ${
                            showPesticidePrices 
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                        title="Toggle Pesticide Prices for Guests"
                    >
                        {showPesticidePrices ? <Eye size={16} /> : <EyeOff size={16} />}
                        <span className="hidden sm:inline uppercase">Prices</span>
                    </button>
                )}
            </div>
          )}

          <div className="relative group w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <Search size={14} className="text-slate-400 group-focus-within:text-green-600" />
            </div>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-green-500 focus:border-transparent outline-none w-full sm:w-48"
            />
          </div>

          <div className="relative w-full sm:w-auto">
            <select 
              className="pl-2 pr-6 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-green-500 outline-none appearance-none bg-white w-full sm:w-auto cursor-pointer"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
            >
              {companies.map(comp => (
                <option key={comp} value={comp}>{comp === 'All' ? 'All Companies' : comp}</option>
              ))}
            </select>
          </div>

          <div className="relative w-full sm:w-auto">
            <select 
              className="pl-2 pr-6 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-green-500 outline-none appearance-none bg-white w-full sm:w-auto cursor-pointer"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>

          <div className="relative w-full sm:w-auto">
            <select 
              className="pl-2 pr-6 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-green-500 outline-none appearance-none bg-white w-full sm:w-auto cursor-pointer"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="name">Name (A-Z)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
              <option value="availability">Availability</option>
              <option value="company">Company (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid - Compact & Organized */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => {
             const averageRating = parseFloat(getAverageRating(product.ratings));

            return (
            <div 
                key={product.id} 
                className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow ${!product.inStock ? 'opacity-80' : ''}`}
                onClickCapture={() => addToRecentlyViewed(product.id)}
            >
              
              {/* Image Area - Clean "Icon" Look */}
              <div 
                className="relative aspect-[4/3] bg-white p-2 group cursor-pointer border-b border-slate-50" 
                onClick={() => openLightbox(product.id)}
              >
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className={`w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 ${!product.inStock ? 'grayscale' : ''}`}
                />
                
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-600 shadow-sm border border-slate-100 z-10">
                  {product.category}
                </div>

                {!product.inStock && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <span className="bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">OUT OF STOCK</span>
                  </div>
                )}
                
                {user && (
                    <>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                if(window.confirm(`Are you sure you want to delete ${product.name}?`)) {
                                    onDeleteProduct(product.id);
                                }
                            }}
                            className="absolute bottom-2 left-2 p-1.5 bg-red-100 text-red-600 rounded-full shadow hover:bg-red-200 transition-colors z-20"
                            title="Delete Product"
                        >
                            <Trash2 size={14} />
                        </button>
                        <button 
                            onClick={(e) => openEditModal(e, product)}
                            className="absolute bottom-2 right-2 p-1.5 bg-blue-100 text-blue-600 rounded-full shadow hover:bg-blue-200 transition-colors z-20"
                            title="Edit Product"
                        >
                            <Edit size={14} />
                        </button>
                    </>
                )}
              </div>

              {/* Content - Spacious & Organized */}
              <div className="p-3 sm:p-4 flex-1 flex flex-col">
                <div className="mb-1">
                     {product.company && (
                        <span className="inline-block bg-green-50 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase mb-1.5 tracking-wide">
                            {product.company}
                        </span>
                    )}
                    <h3 className="font-bold text-sm sm:text-base text-slate-800 leading-snug line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                </div>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                                key={star}
                                size={10} 
                                className={`${
                                    averageRating >= star 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : averageRating >= star - 0.5 
                                        ? 'fill-yellow-400 text-yellow-400 opacity-50'
                                        : 'text-slate-200'
                                }`} 
                            />
                        ))}
                    </div>
                    {averageRating > 0 && (
                        <span className="text-[10px] font-bold text-slate-400">{averageRating}</span>
                    )}
                </div>

                {/* Stock */}
                {renderStockIndicator(product)}

                {/* Price & Actions */}
                <div className="flex items-end justify-between mt-auto pt-3 border-t border-slate-50 gap-2">
                   {isPriceVisible(product) ? (
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-medium">Price</span>
                            <span className={`text-lg font-bold ${!product.inStock ? 'text-slate-400' : 'text-[#2E7D32]'}`}>₹{product.price}</span>
                        </div>
                   ) : (
                        <span className="text-xs font-bold text-slate-400 italic py-2">Call for Price</span>
                   )}
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    {user && product.category === 'Seeds' && (
                        <button onClick={(e) => checkCropSuitability(e, product)} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors" title="AI Check">
                            <Brain size={16} />
                        </button>
                    )}

                    <button 
                        onClick={(e) => { e.stopPropagation(); handleShare(product); }}
                        className="p-2 bg-slate-50 text-slate-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                        <Share2 size={16} />
                    </button>

                    <button 
                         onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                         disabled={!product.inStock}
                         className={`p-2 rounded-lg transition-all shadow-sm flex items-center justify-center ${
                             !product.inStock 
                             ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                             : addedToCart === product.id 
                                ? 'bg-green-600 text-white' 
                                : 'bg-[#2E7D32] text-white hover:bg-green-800'
                        }`}
                    >
                        {addedToCart === product.id ? <Check size={16} /> : <ShoppingCart size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )})}
        </div>
      ) : (
        <div className="text-center py-16">
            <div className="bg-slate-100 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center text-slate-400">
                <Search size={24} />
            </div>
            <h3 className="text-base font-medium text-slate-900">No products found</h3>
            <p className="text-sm text-slate-500">Try adjusting your search.</p>
        </div>
      )}

      {/* Floating Cart Button */}
      {cart.length > 0 && (
          <button 
            onClick={() => { setIsCartOpen(true); setCheckoutStep('cart'); }}
            className="fixed bottom-20 right-4 bg-green-700 text-white p-3 rounded-full shadow-2xl z-40 hover:scale-110 transition-transform flex items-center gap-2"
          >
              <ShoppingCart size={20} />
              <span className="bg-yellow-400 text-green-900 font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.reduce((a, b) => a + b.cartQuantity, 0)}
              </span>
          </button>
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
                 {/* Modal Header */}
                 <div className="bg-green-700 p-4 flex justify-between items-center text-white">
                     <h3 className="text-xl font-bold flex items-center gap-2">
                         {checkoutStep === 'cart' ? <ShoppingCart size={20} /> : <MessageCircle size={20} />}
                         {checkoutStep === 'cart' ? 'Your Cart' : 'Checkout'}
                     </h3>
                     <button onClick={() => setIsCartOpen(false)} className="hover:bg-green-600 p-1 rounded-full"><X size={20} /></button>
                 </div>

                 <div className="p-4 overflow-y-auto flex-1">
                     {checkoutStep === 'cart' ? (
                         <>
                             {cart.length === 0 ? (
                                 <p className="text-center text-slate-500 py-8">Your cart is empty.</p>
                             ) : (
                                 <div className="space-y-3">
                                     {cart.map(item => (
                                         <div key={item.id} className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                             <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                                             <div className="flex-1">
                                                 <h4 className="font-bold text-slate-800 line-clamp-1 text-sm">{item.name}</h4>
                                                 {isPriceVisible(item) ? (
                                                    <p className="text-green-600 font-medium text-xs">₹{item.price}</p>
                                                 ) : (
                                                     <p className="text-slate-500 text-xs italic">Call for Price</p>
                                                 )}
                                             </div>
                                             <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-1">
                                                 <button onClick={() => updateCartQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm hover:bg-slate-100 font-bold text-slate-600">-</button>
                                                 <span className="font-bold w-4 text-center text-sm">{item.cartQuantity}</span>
                                                 <button onClick={() => updateCartQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm hover:bg-slate-100 font-bold text-green-600">+</button>
                                             </div>
                                         </div>
                                     ))}
                                     <div className="flex justify-between items-center pt-3 text-lg font-bold text-slate-800">
                                         <span>Total</span>
                                         <span>₹{cartTotal}</span>
                                     </div>
                                 </div>
                             )}
                         </>
                     ) : (
                         <div className="space-y-3">
                             <p className="text-xs text-slate-500 mb-3">Enter details to order via WhatsApp.</p>
                             <div>
                                 <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                                 <input 
                                    type="text" 
                                    value={customerDetails.name} 
                                    onChange={e => setCustomerDetails({...customerDetails, name: e.target.value})}
                                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                                    placeholder="Your Name"
                                 />
                             </div>
                             <div>
                                 <label className="block text-xs font-medium text-slate-700 mb-1">Mobile Number</label>
                                 <input 
                                    type="tel" 
                                    value={customerDetails.mobile} 
                                    onChange={e => setCustomerDetails({...customerDetails, mobile: e.target.value})}
                                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                                    placeholder="10-digit Mobile Number"
                                 />
                             </div>
                             <div>
                                 <label className="block text-xs font-medium text-slate-700 mb-1">Delivery Address</label>
                                 <textarea 
                                    rows={3} 
                                    value={customerDetails.address} 
                                    onChange={e => setCustomerDetails({...customerDetails, address: e.target.value})}
                                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                                    placeholder="House No, Street, Village..."
                                 />
                             </div>
                         </div>
                     )}
                 </div>

                 <div className="p-4 border-t border-slate-100 bg-slate-50">
                     {checkoutStep === 'cart' ? (
                         <button 
                            onClick={() => setCheckoutStep('details')} 
                            disabled={cart.length === 0}
                            className="w-full bg-green-700 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                         >
                             Proceed to Checkout
                         </button>
                     ) : (
                         <div className="flex gap-2">
                             <button onClick={() => setCheckoutStep('cart')} className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-300 text-sm">Back</button>
                             <button onClick={handlePlaceOrder} className="flex-[2] bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-green-700 flex items-center justify-center gap-2 text-sm">
                                 <MessageCircle size={18} />
                                 Order on WhatsApp
                             </button>
                         </div>
                     )}
                 </div>
             </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxState.productId !== null && (() => {
          const product = products.find(p => p.id === lightboxState.productId);
          if (!product) return null;
          const allImages = product.images ? [product.image, ...product.images] : [product.image];
          const currentImg = allImages[lightboxState.imageIndex];

          return (
              <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center animate-in fade-in duration-200" onClick={closeLightbox}>
                  <button className="absolute top-4 right-4 text-white hover:text-slate-300 p-2" onClick={closeLightbox}>
                      <X size={28} />
                  </button>
                  
                  <div className="relative w-full max-w-4xl h-[80vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
                      <img src={currentImg} alt="Fullscreen" className="max-w-full max-h-full object-contain" />
                      
                      {allImages.length > 1 && (
                          <>
                            <button 
                                onClick={(e) => prevLightboxImage(e, allImages)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                            >
                                <ArrowUpDown className="rotate-90" size={20} />
                            </button>
                            <button 
                                onClick={(e) => nextLightboxImage(e, allImages)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                            >
                                <ArrowUpDown className="-rotate-90" size={20} />
                            </button>
                          </>
                      )}
                  </div>
                  
                  {/* Thumbnails Strip in Lightbox */}
                  {allImages.length > 1 && (
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] p-2 bg-black/50 rounded-xl backdrop-blur-sm" onClick={e => e.stopPropagation()}>
                          {allImages.map((img, idx) => (
                              <button 
                                key={idx} 
                                onClick={() => setLightboxState(prev => ({ ...prev, imageIndex: idx }))}
                                className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${lightboxState.imageIndex === idx ? 'border-green-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                              >
                                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                              </button>
                          ))}
                      </div>
                  )}
              </div>
          );
      })()}

      {/* AI Suitability Result Modal */}
      {isSuitabilityModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-5 animate-in fade-in zoom-in duration-200">
                  <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                          <Brain className="text-indigo-600" size={20} />
                          Suitability Check
                      </h3>
                      <button onClick={() => setIsSuitabilityModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                          <X size={20} />
                      </button>
                  </div>
                  
                  {isSuitabilityLoading ? (
                      <div className="flex flex-col items-center justify-center py-8 space-y-3">
                          <Loader2 className="animate-spin text-indigo-600" size={32} />
                          <p className="text-slate-500 text-sm font-medium animate-pulse">Analyzing...</p>
                      </div>
                  ) : (
                      <div className="space-y-3">
                          <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                              <h4 className="font-bold text-indigo-900 text-sm mb-1">{suitabilityData?.productName}</h4>
                              <p className="text-xs text-indigo-700 leading-relaxed whitespace-pre-wrap">
                                  {suitabilityData?.advice}
                              </p>
                          </div>
                          <p className="text-[10px] text-slate-400 italic text-center">
                              *AI recommendation based on Keliweli region.
                          </p>
                          <button 
                            onClick={() => setIsSuitabilityModalOpen(false)}
                            className="w-full bg-slate-800 text-white py-2.5 rounded-xl font-bold hover:bg-slate-700 transition-colors text-sm"
                          >
                              Close
                          </button>
                      </div>
                  )}
              </div>
          </div>
      )}
      
      {/* Add Product Modal */}
      {isAddModalOpen && user && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Add New Product</h3>
                        <p className="text-xs text-slate-500">Enter product details below</p>
                    </div>
                    <button onClick={() => setIsAddModalOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleAddProductSubmit} className="space-y-4">
                    {/* Image Upload Section */}
                    <div className="flex flex-col items-center justify-center mb-4">
                        <div className="relative w-32 h-32 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden mb-3 group hover:border-green-500 transition-colors">
                            {newProduct.image ? (
                                <img src={newProduct.image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-2">
                                    <ImageIcon className="mx-auto text-slate-400 mb-1" size={24} />
                                    <span className="text-[10px] text-slate-400">No Image</span>
                                </div>
                            )}
                        </div>
                        <label className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm border border-slate-200">
                            <Upload size={14} />
                            Upload Photo
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleImageUpload} 
                            />
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 ml-1">Product Name</label>
                            <input 
                                type="text" 
                                className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-green-500 text-sm" 
                                placeholder="e.g. Bt Cotton Seeds"
                                value={newProduct.name} 
                                onChange={e => setNewProduct({...newProduct, name: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="space-y-1">
                             <label className="text-xs font-bold text-slate-700 ml-1">Price (₹)</label>
                            <input 
                                type="number" 
                                className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-green-500 text-sm" 
                                placeholder="0.00"
                                value={newProduct.price} 
                                onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 ml-1">Category</label>
                            <select 
                                className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-green-500 text-sm appearance-none" 
                                value={newProduct.category} 
                                onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                            >
                                <option>Seeds</option>
                                <option>Fertilizers</option>
                                <option>Pesticides</option>
                                <option>Equipment</option>
                                <option>Supplements</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                             <label className="text-xs font-bold text-slate-700 ml-1">Company / Brand</label>
                            <input 
                                type="text" 
                                className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-green-500 text-sm" 
                                placeholder="e.g. Ankur, Bayer"
                                value={newProduct.company} 
                                onChange={e => setNewProduct({...newProduct, company: e.target.value})} 
                            />
                        </div>
                    </div>

                     <div className="space-y-1">
                         <label className="text-xs font-bold text-slate-700 ml-1">Description</label>
                         <textarea 
                             className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-green-500 text-sm h-24 resize-none" 
                             placeholder="Enter product details..."
                             value={newProduct.description} 
                             onChange={e => setNewProduct({...newProduct, description: e.target.value})} 
                         />
                     </div>
                    
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 ml-1">Initial Stock</label>
                        <input 
                            type="number" 
                            className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-green-500 text-sm" 
                            placeholder="e.g. 50"
                            value={newProduct.quantity} 
                            onChange={e => setNewProduct({...newProduct, quantity: parseInt(e.target.value)})} 
                        />
                     </div>

                     <button type="submit" className="w-full bg-[#2E7D32] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-800 transition-all mt-2">
                        Add Product
                     </button>
                </form>
            </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && user && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Edit Product</h3>
                        <p className="text-xs text-slate-500">Update product details below</p>
                    </div>
                    <button onClick={() => setEditingProduct(null)} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleEditProductSubmit} className="space-y-4">
                    {/* Image Upload Section */}
                    <div className="flex flex-col items-center justify-center mb-4">
                        <div className="relative w-32 h-32 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden mb-3 group hover:border-blue-500 transition-colors">
                            {editingProduct.image ? (
                                <img src={editingProduct.image} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center p-2">
                                    <ImageIcon className="mx-auto text-slate-400 mb-1" size={24} />
                                    <span className="text-[10px] text-slate-400">No Image</span>
                                </div>
                            )}
                        </div>
                        <label className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm border border-blue-200">
                            <Upload size={14} />
                            Change Photo
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleEditImageUpload} 
                            />
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 ml-1">Product Name</label>
                            <input 
                                type="text" 
                                className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                                value={editingProduct.name} 
                                onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="space-y-1">
                             <label className="text-xs font-bold text-slate-700 ml-1">Price (₹)</label>
                            <input 
                                type="number" 
                                className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                                value={editingProduct.price} 
                                onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 ml-1">Category</label>
                            <select 
                                className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none" 
                                value={editingProduct.category} 
                                onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}
                            >
                                <option>Seeds</option>
                                <option>Fertilizers</option>
                                <option>Pesticides</option>
                                <option>Equipment</option>
                                <option>Supplements</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                             <label className="text-xs font-bold text-slate-700 ml-1">Company / Brand</label>
                            <input 
                                type="text" 
                                className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                                value={editingProduct.company || ''} 
                                onChange={e => setEditingProduct({...editingProduct, company: e.target.value})} 
                            />
                        </div>
                    </div>

                     <div className="space-y-1">
                         <label className="text-xs font-bold text-slate-700 ml-1">Description</label>
                         <textarea 
                             className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 text-sm h-24 resize-none" 
                             value={editingProduct.description} 
                             onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} 
                         />
                     </div>
                    
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 ml-1">Current Stock</label>
                        <input 
                            type="number" 
                            className="w-full border border-slate-200 p-3 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 text-sm" 
                            value={editingProduct.quantity} 
                            onChange={e => setEditingProduct({...editingProduct, quantity: parseInt(e.target.value)})} 
                        />
                     </div>

                     <button type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all mt-2">
                        Update Product
                     </button>
                </form>
            </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      {isScannerOpen && (
           <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
               <div className="absolute top-0 w-full p-4 flex justify-between items-center z-10">
                   <h3 className="text-white font-bold text-sm">Scan QR</h3>
                   <button onClick={() => setIsScannerOpen(false)} className="text-white"><X size={20} /></button>
               </div>
               <div className="relative w-full h-full flex items-center justify-center bg-black">
                   {cameraStream ? <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-80" /> : <div className="text-white text-sm">Loading Camera...</div>}
               </div>
               <div className="absolute bottom-8 flex gap-4">
                   <button onClick={() => handleScanResult("1")} className="bg-white/20 text-white px-4 py-2 rounded text-sm">Test Scan</button>
               </div>
           </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 w-max max-w-[90%]">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-2xl text-white ${
                notification.type === 'success' ? 'bg-green-700' : notification.type === 'error' ? 'bg-red-600' : 'bg-slate-800'
            }`}>
                {notification.type === 'success' ? <Check size={14} /> : notification.type === 'error' ? <AlertCircle size={14} /> : <AlertCircle size={14} />}
                <span className="text-xs font-medium">{notification.message}</span>
            </div>
        </div>
      )}
    </div>
  );
};
