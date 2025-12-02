
import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, ExternalLink } from 'lucide-react';

export const Contact: React.FC = () => {
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Kastkar+Krushi+Seva+Kendra+At+Post+Keliweli+Tq+Akot+Dist+Akola";

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Contact Info */}
        <div className="bg-green-800 text-white p-10 md:w-2/5 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-6">Visit Us</h2>
            <p className="text-green-100 mb-8 leading-relaxed">
              We are located in the heart of Keliweli. Drop by for a cup of tea and discuss your farming needs.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="mt-1 text-yellow-400" size={24} />
                <div>
                  <h4 className="font-semibold text-lg">Address</h4>
                  <p className="text-green-100 text-sm">
                    Kastkar Krushi Seva Kendra,<br/>
                    At Post Keliweli, Tq. Akot,<br/>
                    Dist. Akola, Maharashtra 444111
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Phone className="text-yellow-400" size={24} />
                <div>
                  <h4 className="font-semibold text-lg">Phone</h4>
                  <p className="text-green-100 text-sm">+91 89996 78500</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <MessageCircle className="text-yellow-400" size={24} />
                <div>
                  <h4 className="font-semibold text-lg">WhatsApp</h4>
                  <p className="text-green-100 text-sm">+91 89996 78500</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Mail className="text-yellow-400" size={24} />
                <div>
                  <h4 className="font-semibold text-lg">Email</h4>
                  <p className="text-green-100 text-sm">shamb473@gmail.com</p>
                </div>
              </div>

               <div className="flex items-center space-x-4">
                <Clock className="text-yellow-400" size={24} />
                <div>
                  <h4 className="font-semibold text-lg">Hours</h4>
                  <p className="text-green-100 text-sm">Mon - Sat: 8:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-green-700">
             <p className="text-sm text-green-300">© 2024 Kastkar Krushi Seva Kendra</p>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="md:w-3/5 bg-slate-100 relative min-h-[400px] group overflow-hidden">
             {/* Using an image placeholder for map as actual Google Maps requires a separate API Key */}
             <img 
                src="https://picsum.photos/800/600?grayscale" 
                alt="Map Location" 
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
             />
             <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
             
             <div className="absolute inset-0 flex items-center justify-center p-4">
                 <a 
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl text-center transform transition-all duration-300 hover:scale-105 hover:bg-white cursor-pointer border-2 border-white/50"
                 >
                     <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <MapPin className="text-red-600" size={32} />
                     </div>
                     <h3 className="text-2xl font-bold text-slate-800 mb-1">Keliweli Shop</h3>
                     <p className="text-slate-500 mb-4 text-sm">Click to navigate</p>
                     
                     <div className="flex items-center justify-center gap-2 text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-full hover:bg-blue-100 transition-colors">
                        <span>Open Google Maps</span>
                        <ExternalLink size={16} />
                     </div>
                 </a>
             </div>
        </div>
      </div>
    </div>
  );
};
