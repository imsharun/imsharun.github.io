
import img19 from '../assets/sample-images/Group 19.png';
import img22 from '../assets/sample-images/Group 22.png';
import img24 from '../assets/sample-images/Group 24.png';
import img25 from '../assets/sample-images/Group 25.png';
import img30 from '../assets/sample-images/Group 30.png';
import img12 from '../assets/sample-images/Group 12.png';
import img14 from '../assets/sample-images/Group 14.png';
import img17 from '../assets/sample-images/Group 17.png';
import img13 from '../assets/sample-images/Group 13.png';
import type { ProductCatalog } from '../types';


export const catalog: ProductCatalog = {
  spices: [
    { 
      id: 1,
      name: "Cardamom", 
      price: { "250g": 1140, "500g": 2110 },
      image: img30,
      description: "Premium green cardamom pods with aromatic flavor, perfect for chai, desserts, and spice blends."
    },
    { 
      id: 2,
      name: "Cinnamon", 
      price: { "250g": 380, "500g": 790 },
      image: img14,
      description: "Warm and sweet cinnamon sticks ideal for beverages, baking, and traditional curries."
    },
    { 
      id: 3,
      name: "Star Anise", 
      price: { "250g": 290, "500g": 580 },
      image: img13,
      description: "Distinctive star-shaped spice with licorice notes, essential for Asian cuisine and broths."
    },
    { 
      id: 4,
      name: "Black Pepper", 
      price: { "250g": 210, "500g": 390 },
      image: img12,
      description: "Premium whole black peppercorns with sharp, pungent flavor for everyday cooking."
    },
    { 
      id: 5,
      name: "Tamarind", 
      price: { "250g": 160, "500g": 270 },
      image: img17,
      description: "Tangy tamarind pods adding sourness and depth to curries, chutneys, and drinks."
    },
    { 
      id: 6,
      name: "Cloves", 
      price: { "250g": 490, "500g": 1050 },
      image: img22,
      description: "Aromatic clove buds with warm, sweet flavor perfect for both sweet and savory dishes."
    },
  ],
  powders: [
    { 
      id: 7,
      name: "Chilli Powder", 
      price: { "250g": 170, "500g": 340 },
      image: img24,
      description: "Spicy red chilli powder bringing heat and vibrant color to your favorite meals."
    },
    { 
      id: 8,
      name: "Coriander Powder", 
      price: { "250g": 120, "500g": 210 },
      image: img25,
      description: "Ground coriander with citrusy, warm notes ideal for curries and seasoning blends."
    },
    { 
      id: 9,
      name: "Turmeric Powder", 
      price: { "250g": 110, "500g": 220 },
      image: img19,
      description: "Golden turmeric powder with earthy flavor and natural health benefits for cooking."
    },
    { 
      id: 10,
      name: "Tea Powder", 
      price: { "250g": 350, "500g": 690 },
      image: img22,
      description: "Finely ground tea powder perfect for authentic Indian chai and traditional preparations."
    },
  ],
  liquidEssentials: [
    { 
      id: 11,
      name: "Coconut Oil", 
      price: { "250ml": 160, "500ml": 300 },
      image: img24,
      description: "Pure virgin coconut oil with natural coconut aroma for cooking and wellness applications."
    },
    { 
      id: 12,
      name: "Pure Honey", 
      price: { "250ml": 970, "500ml": 1950 },
      image: img25,
      description: "Raw, unprocessed honey with rich flavor, perfect for sweetening and natural health benefits."
    },
  ]

};
