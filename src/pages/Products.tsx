import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard/ProductCard';
//import Loader from '../components/Common/Loader/Loader';
import { liquidThumbmails, powderThumbnails } from '../data/thumbnails';
//import loaderLight from '../assets/loader-light.gif';
import type { OreganoProduct } from '../types';
import leftArrow from '../assets/icons/left-arrow.png';
import rightArrow from '../assets/icons/right-arrow.png';
import oreganoHomeGif from '../assets/gallery/oregano-home.gif';
import gallery1 from '../assets/gallery/gallery1.png';
import gallery2 from '../assets/gallery/gallery2.png';
import {catalog} from '../data/allproducts';

import './Products.css';
import Icon from '../components/Common/Icon/Icon';
import Header from '../components/Home/Home';

export default function Products() {
 
  const [products, setProducts] = useState<OreganoProduct[]>([]);
  

  const categories: (keyof typeof catalog)[] = ['spices', 'powders', 'liquidEssentials'];
  const [index, setIndex] = useState(0);

  const activeKey = categories[index];

 
  const next = () => {
    setIndex((i) => {
      const newIndex = (i + 1) % categories.length;
      return newIndex;
    });
  };

  const prev = () => {
    setIndex((i) => {
      const newIndex = (i - 1 + categories.length) % categories.length;
      return newIndex;
    });
  };

  useEffect(() => {
    // Load products for the active category; fallback to empty to avoid undefined
    setProducts(catalog[activeKey] ?? []);
  }, [activeKey]);



  // if (loading) {
  //   return (
  //     <section style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
  //       <Loader light={loaderLight} dark={loaderLight} alt="Loading" />
  //     </section>
  //   );
  // }

  return (
    <section>
      <Header carouselIndex={index} />
    <div className="products-page" id='products-section'>  

      <div className='title'>Our Products</div>
      <section className="carousel">

        {/* Category selector */}
        <div className="category-nav">
          <button onClick={prev}>
            <Icon light={leftArrow} alt="Prev" />
          </button>
          <div>
            {activeKey === 'spices'
              ? 'Spices'
              : activeKey === 'powders'
              ? 'Powders'
              : 'Liquid Essentials'}
          </div>
          <button onClick={next}>
            <Icon light={rightArrow} alt="Next" />
          </button>
        </div>

      <section className="thumbnails-and-products" key={activeKey}>
        {/* Thumbnails */}
        
        <div className="thumbnails">
          {(activeKey === 'powders' ? powderThumbnails : liquidThumbmails).map((thumbnail, i) => (
            <img key={i} src={thumbnail} alt="" />
          ))}
        </div>
        <div className="grid">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
      </section>

      {/* Gallery Section */}
      <div className='gallery-gif-container'>
        <img src={oreganoHomeGif} className="gallery-gif" />
      </div>

      <div className='gallery-images-container'>
        <img src={gallery1} className="gallery-image" />
        <img src={gallery2} className="gallery-image" />
      </div>
    </div>
    </section>

  );
}