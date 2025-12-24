import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard/ProductCard';
import Loader from '../components/Common/Loader/Loader';
import { liquidProducts, powderProducts } from '../data/products';
import { liquidThumbmails, powderThumbnails } from '../data/thumbnails';
import loaderLight from '../assets/loader-light.gif';
import type { Product } from '../types';
import leftArrow from '../assets/icons/left-arrow.png';
import rightArrow from '../assets/icons/right-arrow.png';
import oreganoHomeGif from '../assets/gallery/oregano-home.gif';
import gallery1 from '../assets/gallery/gallery1.png';
import gallery2 from '../assets/gallery/gallery2.png';

import './Products.css';
import Icon from '../components/Common/Icon/Icon';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [0, 1];
  const [index, setIndex] = useState(0);

  const activeKey = categories[index];

  const next = () => setIndex((i) => (i + 1) % categories.length);
  const prev = () => setIndex((i) => (i - 1 + categories.length) % categories.length);

  useEffect(() => {
    // Simulate backend fetch with 5-second delay
    const timer = setTimeout(() => {
      if (activeKey === 0) setProducts(powderProducts);
      else
        setProducts(liquidProducts);
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [index]);



  if (loading) {
    return (
      <section style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Loader light={loaderLight} dark={loaderLight} alt="Loading" />
      </section>
    );
  }

  return (
    <div className="products-page">
      <div className='title'>Our Products</div>
      <section className="carousel">

        {/* Category selector */}
        <div className="category-nav">
          <button onClick={prev}>
            <Icon light={leftArrow} alt="Prev" />
          </button>
          <div>{activeKey === 0 ? "Spices" : "Liquid Essentials"}</div>
          <button onClick={next}>
            <Icon light={rightArrow} alt="Next" />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="thumbnails">
          {(activeKey === 0 ? powderThumbnails : liquidThumbmails).map((thumbnail, i) => (
            <img key={i} src={thumbnail} alt="" />
          ))}
        </div>
        <div className="grid">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
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
  );
}