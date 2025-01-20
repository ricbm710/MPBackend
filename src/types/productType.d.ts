export interface Product {
  id: number;
  name: string;
  price: number;
  product_condition: string;
  description: string;
  city: string;
  image_name: string;
  user_id: number;
  published_date: Date;
  db_active: boolean;
}
