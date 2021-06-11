export interface FoodType{
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

export type FoodInput = Omit<FoodType, 'id'|'available'>;