
import React, { useState, useEffect } from 'react';
import { Sprout, Award, Users, MapPin, CheckCircle, Clock, ShieldCheck, Heart, Leaf, Camera, Trash2, Plus, Upload } from 'lucide-react';
import { User } from '../types';

interface AboutProps {
  user: User | null;
}

export const About: React.FC<AboutProps> = ({ user }) => {
  // --- Owner Image State ---
  const [ownerImage, setOwnerImage] = useState<string>(() => {
    try {
      return localStorage.getItem('kastkar_owner_image') || '';
    } catch (e) {
      return '';
    }
  });

  const handleOwnerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setOwnerImage(result);
        localStorage.setItem('kastkar_owner_image', result);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Gallery State ---
  const DEFAULT_GALLERY = [
       { src: "https://picsum.photos/400/400?random=50", label: "Shop Front" },
       { src: "https://picsum.photos/400/400?random=51", label: "Warehouse" },
       { src: "https://picsum.photos/400/400?random=52", label: "Farmer Meeting" },
       { src: "https://picsum.photos/400/400?random=53", label: "Awards" }
  ];

  const [galleryImages, setGalleryImages] = useState<{src: string, label: string}[]>(() => {
      try {
          const saved = localStorage.getItem('kastkar_gallery_images');
          return saved ? JSON.parse(saved) : DEFAULT_GALLERY;
      } catch (e) {
          return DEFAULT_GALLERY;
      }
  });

  // Save gallery to local storage whenever it changes
  useEffect(() => {
      localStorage.setItem('kastkar_gallery_images', JSON.stringify(galleryImages));
  }, [galleryImages]);

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            // Simple prompt for label, could be improved with a modal but this is efficient
            const label = window.prompt("Enter a label for this photo (e.g., Shop, Event):", "Kendra Photo") || "Kendra Photo";
            setGalleryImages(prev => [...prev, { src: reader.result as string, label }]);
        };
        reader.readAsDataURL(file);
    }
  };

  const removeGalleryImage = (index: number) => {
      if(window.confirm("Are you sure you want to remove this photo?")) {
          setGalleryImages(prev => prev.filter((_, i) => i !== index));
      }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      
      {/* Hero Section */}
      <div className="relative bg-[#2E7D32] rounded-3xl overflow-hidden shadow-2xl mb-10 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="relative z-10 p-8 md:p-16 text-center">
              <div className="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md shadow-lg">
                  <Sprout size={48} className="text-[#FBC02D]" />
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
                  Kastkar Krushi Seva Kendra
              </h1>
              <p className="text-xl text-green-100 font-medium max-w-2xl mx-auto">
                  Trusted Partner of Farmers in Keliweli & Akot Region Since 2012
              </p>
              <div className="mt-8 inline-flex items-center gap-2 bg-[#FBC02D] text-[#1B5E20] px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                  <MapPin size={18} /> At Post Keliweli, Tq. Akot
              </div>
          </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
          
          {/* Owner Profile */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 relative overflow-hidden group hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 bg-yellow-400 w-24 h-24 rounded-bl-full -mr-12 -mt-12 z-0 opacity-50"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                   <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden mb-6 bg-slate-200 relative group">
                        {ownerImage ? (
                            <img src={ownerImage} alt="Owner" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white text-4xl font-bold">
                                S
                            </div>
                        )}
                        
                        {user && (
                            <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <Camera className="text-white mb-1" size={20} />
                                <span className="text-[10px] text-white font-bold">Change Photo</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleOwnerImageUpload} />
                            </label>
                        )}
                   </div>
                   <h2 className="text-2xl font-bold text-slate-800">Sham Dinesh Bakal</h2>
                   <p className="text-slate-500 font-medium mb-4">Owner & Agri-Expert</p>
                   
                   <p className="text-slate-600 leading-relaxed italic">
                       "Our mission is not just to sell products, but to educate farmers. I believe that when a farmer prospers, the whole nation prospers. At Kastkar, we treat every farmer like family."
                   </p>

                   <div className="mt-6 flex gap-4 w-full">
                       <div className="flex-1 bg-green-50 p-3 rounded-xl">
                           <h4 className="font-bold text-green-700 text-lg">12+</h4>
                           <p className="text-xs text-green-600 font-bold uppercase">Years Exp.</p>
                       </div>
                       <div className="flex-1 bg-blue-50 p-3 rounded-xl">
                           <h4 className="font-bold text-blue-700 text-lg">5000+</h4>
                           <p className="text-xs text-blue-600 font-bold uppercase">Happy Farmers</p>
                       </div>
                   </div>
              </div>
          </div>

          {/* Why Choose Us */}
          <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-start">
                  <div className="bg-green-100 p-3 rounded-xl text-green-700 shrink-0">
                      <ShieldCheck size={28} />
                  </div>
                  <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-1">Authentic Products</h3>
                      <p className="text-slate-600 text-sm">
                          We are authorized dealers for major brands like Bayer, Syngenta, Ankur Seeds, and IFFCO. 100% original products guaranteed.
                      </p>
                  </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-start">
                  <div className="bg-blue-100 p-3 rounded-xl text-blue-700 shrink-0">
                      <Leaf size={28} />
                  </div>
                  <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-1">Expert Consultation</h3>
                      <p className="text-slate-600 text-sm">
                          Free guidance on crop diseases, fertilizer scheduling, and pest management for Cotton, Soybean, and Gram.
                      </p>
                  </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-4 items-start">
                  <div className="bg-yellow-100 p-3 rounded-xl text-yellow-700 shrink-0">
                      <Heart size={28} />
                  </div>
                  <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-1">Farmer-First Approach</h3>
                      <p className="text-slate-600 text-sm">
                          Reasonable rates and dedicated support for the farming community of Keliweli and Akot taluka.
                      </p>
                  </div>
              </div>
          </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
          
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                  <div className="text-4xl font-extrabold text-[#FBC02D]">2012</div>
                  <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Established</div>
              </div>
              <div className="space-y-2">
                  <div className="text-4xl font-extrabold text-green-400">50+</div>
                  <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Product Brands</div>
              </div>
              <div className="space-y-2">
                  <div className="text-4xl font-extrabold text-blue-400">10k+</div>
                  <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Acres Served</div>
              </div>
              <div className="space-y-2">
                  <div className="text-4xl font-extrabold text-purple-400">24/7</div>
                  <div className="text-sm font-medium text-slate-400 uppercase tracking-wider">Support</div>
              </div>
          </div>
      </div>

      {/* Legacy / History Text */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 mb-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Clock className="text-green-700" />
              Our Journey (आमचा प्रवास)
          </h3>
          <div className="prose prose-slate max-w-none text-slate-600">
              <p className="mb-4">
                  <strong>Kastkar Krushi Seva Kendra</strong> was established in <strong>2012</strong> with a single vision: to bridge the gap between modern agricultural technology and the traditional farmer. Located in the heart of <strong>Keliweli</strong>, we noticed that farmers often struggled to get genuine fertilizers and accurate advice.
              </p>
              <p className="mb-4">
                  Over the last decade, we have grown from a small shop to a comprehensive agricultural service center. We introduced digital payment methods, organized soil testing camps, and now, we are proud to launch this <strong>Digital App</strong> to bring services directly to your smartphone.
              </p>
              <p>
                  Today, we serve farmers not just in Keliweli, but across the entire Akot and Akola belt. We are committed to increasing your yield and reducing your input costs through smart farming solutions.
              </p>
          </div>
      </div>

      {/* Kendra Gallery */}
      <div>
          <div className="flex justify-between items-center mb-6 px-2">
              <h3 className="text-2xl font-bold text-slate-800">Kendra Gallery</h3>
              {user && (
                  <label className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer hover:bg-green-200 transition-colors">
                      <Plus size={16} /> Add Photo
                      <input type="file" accept="image/*" className="hidden" onChange={handleGalleryUpload} />
                  </label>
              )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {galleryImages.map((img, idx) => (
                   <div key={idx} className="aspect-square bg-slate-200 rounded-2xl overflow-hidden relative group">
                       <img src={img.src} alt={img.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-xs p-2 backdrop-blur-sm">
                           {img.label}
                       </div>
                       
                       {user && (
                           <button 
                                onClick={() => removeGalleryImage(idx)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                                title="Remove Photo"
                           >
                               <Trash2 size={14} />
                           </button>
                       )}
                   </div>
               ))}
               
               {/* Empty State / Add Placeholder if gallery is empty */}
               {galleryImages.length === 0 && (
                   <div className="col-span-full py-8 text-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                       <p>No photos in gallery yet.</p>
                       {user && <p className="text-xs mt-1">Click "Add Photo" to upload.</p>}
                   </div>
               )}
          </div>
      </div>

    </div>
  );
};
