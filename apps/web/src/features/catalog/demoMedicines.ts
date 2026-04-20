import type { Medicine } from "../../types/domain";

export const demoMedicines: Medicine[] = [
  {
    id: "m-para-500",
    name: "Paracetamol 500mg",
    brand: "Medigo",
    category: "Pain relief",
    description: "Common pain reliever and fever reducer.",
    price: 2.5,
    stockQty: 64,
    isPublished: true,
  },
  {
    id: "m-ibuprofen-200",
    name: "Ibuprofen 200mg",
    brand: "HealWell",
    category: "Anti-inflammatory",
    description: "Helps reduce inflammation and relieve pain.",
    price: 3.75,
    stockQty: 18,
    isPublished: true,
  },
  {
    id: "m-vitc-1000",
    name: "Vitamin C 1000mg",
    brand: "VitaPlus",
    category: "Supplements",
    description: "Daily immune support supplement.",
    price: 5.2,
    stockQty: 0,
    isPublished: true,
  },
  {
    id: "m-cetirizine-10",
    name: "Cetirizine 10mg",
    brand: "AllerFree",
    category: "Allergy",
    description: "Non-drowsy antihistamine for allergy relief.",
    price: 4.1,
    stockQty: 25,
    isPublished: true,
  },
];

