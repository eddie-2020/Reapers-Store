// // components/HeroBanner.jsx
// import { useNavigate } from "react-router-dom";

// export default function HeroBanner() {
//     const navigate = useNavigate()

//     const handleShopClick = () => {
//         navigate('/products');
//     };


//   return (
//     <div className="relative h-96 md:h-[500px] w-full overflow-hidden">
//       <img
//         src="https://res.cloudinary.com/ddw7sjyos/image/upload/v1761242159/branden-skeli-2k7uvxx37UU-unsplash_vru3zy.jpg"
//         alt="Profile"
//         className="w-full h-full object-cover"
//       />
      
//       {/* Gradient Overlay */}
//       <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
      
//       {/* Text Content */}
//       <div className="absolute inset-0 flex items-center">
//         <div className="max-w-7xl mx-auto px-6 w-full">
//           <div className="max-w-2xl">
//             <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-serif">
//               Welcome to REAPERS
//             </h1>
//             <p className="text-xl text-gray-200 mb-8 leading-relaxed">
//               Discover premium fashion curated with exceptional taste and attention to detail. 
//               Where style meets sophistication.
//             </p>
//             <button onClick={handleShopClick} className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105">
//               Shop Collection
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// components/HeroBanner.jsx
// import { useNavigate } from 'react-router-dom';

// export default function HeroBanner() {
//   const navigate = useNavigate();

//   const handleShopClick = () => {
//     navigate('/catalog');
//   };

//   return (
//     <div className="relative h-96 md:h-[500px] w-full overflow-hidden">
//       <img
//         src="/hero.jpeg" // Your hero image
//         alt="REAPERS Premium Fashion"
//         className="w-full h-full object-cover"
//       />
      
//       {/* Gradient Overlay */}
//       <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
      
//       {/* Text Content */}
//       <div className="absolute inset-0 flex items-center">
//         <div className="max-w-7xl mx-auto px-6 w-full">
//           <div className="max-w-2xl">
//             <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-serif">
//               Welcome to REAPERS
//             </h1>
//             <p className="text-xl text-gray-200 mb-8 leading-relaxed">
//               Discover premium fashion curated with exceptional taste and attention to detail. 
//               Where style meets sophistication.
//             </p>
//             <button 
//               onClick={handleShopClick}
//               className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
//             >
//               Shop Collection
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// components/HeroBanner.jsx
export default function HeroBanner({ onShopClick }) {
  return (
    <div className="relative h-96 md:h-[500px] w-full overflow-hidden">
      <img
        src="/hero.jpeg"
        alt="REAPERS Premium Fashion"
        className="w-full h-full object-cover"
      />
      
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
      
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-serif">
              Welcome to REAPERS
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Discover premium fashion curated with exceptional taste and attention to detail.
            </p>
            <button 
              onClick={onShopClick}
              className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
            >
              Shop Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}