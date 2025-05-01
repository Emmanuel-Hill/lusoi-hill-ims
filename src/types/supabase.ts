
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: string
          active: boolean
          created_at: string
          last_login: string | null
          password: string | null
          initial_login_complete: boolean
        }
        Insert: {
          id?: string
          name: string
          email: string
          role: string
          active?: boolean
          created_at?: string
          last_login?: string | null
          password?: string | null
          initial_login_complete?: boolean
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: string
          active?: boolean
          created_at?: string
          last_login?: string | null
          password?: string | null
          initial_login_complete?: boolean
        }
        Relationships: []
      }
      module_access: {
        Row: {
          id: string
          user_id: string
          dashboard: boolean
          batches: boolean
          egg_collection: boolean
          feed_management: boolean
          vaccination: boolean
          sales: boolean
          customers: boolean
          calendar: boolean
          reports: boolean
          user_management: boolean
          warehouse: boolean
        }
        Insert: {
          id?: string
          user_id: string
          dashboard?: boolean
          batches?: boolean
          egg_collection?: boolean
          feed_management?: boolean
          vaccination?: boolean
          sales?: boolean
          customers?: boolean
          calendar?: boolean
          reports?: boolean
          user_management?: boolean
          warehouse?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          dashboard?: boolean
          batches?: boolean
          egg_collection?: boolean
          feed_management?: boolean
          vaccination?: boolean
          sales?: boolean
          customers?: boolean
          calendar?: boolean
          reports?: boolean
          user_management?: boolean
          warehouse?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "module_access_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      batches: {
        Row: {
          id: string
          name: string
          bird_count: number
          batch_status: string
          created_at: string
          notes: string | null
        }
        Insert: {
          id?: string
          name: string
          bird_count: number
          batch_status: string
          created_at?: string
          notes?: string | null
        }
        Update: {
          id?: string
          name?: string
          bird_count?: number
          batch_status?: string
          created_at?: string
          notes?: string | null
        }
        Relationships: []
      }
      egg_collections: {
        Row: {
          id: string
          batch_id: string
          date: string
          whole_count: number
          broken_count: number
          small_eggs: number
          medium_eggs: number
          large_eggs: number
          xl_eggs: number
          good_eggs: number
          broken_eggs: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          batch_id: string
          date: string
          whole_count: number
          broken_count: number
          small_eggs?: number
          medium_eggs?: number
          large_eggs?: number
          xl_eggs?: number
          good_eggs?: number
          broken_eggs?: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          batch_id?: string
          date?: string
          whole_count?: number
          broken_count?: number
          small_eggs?: number
          medium_eggs?: number
          large_eggs?: number
          xl_eggs?: number
          good_eggs?: number
          broken_eggs?: number
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "egg_collections_batch_id_fkey"
            columns: ["batch_id"]
            referencedRelation: "batches"
            referencedColumns: ["id"]
          }
        ]
      }
      feed_types: {
        Row: {
          id: string
          name: string
          description: string | null
          bird_type: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          bird_type: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          bird_type?: string
        }
        Relationships: []
      }
      feed_inventory: {
        Row: {
          id: string
          feed_type_id: string
          quantity_kg: number
          date: string
          is_produced: boolean
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          feed_type_id: string
          quantity_kg: number
          date: string
          is_produced: boolean
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          feed_type_id?: string
          quantity_kg?: number
          date?: string
          is_produced?: boolean
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_inventory_feed_type_id_fkey"
            columns: ["feed_type_id"]
            referencedRelation: "feed_types"
            referencedColumns: ["id"]
          }
        ]
      }
      feed_consumption: {
        Row: {
          id: string
          batch_id: string
          feed_type_id: string
          quantity_kg: number
          date: string
          time_of_day: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          batch_id: string
          feed_type_id: string
          quantity_kg: number
          date: string
          time_of_day: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          batch_id?: string
          feed_type_id?: string
          quantity_kg?: number
          date?: string
          time_of_day?: string
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feed_consumption_batch_id_fkey"
            columns: ["batch_id"]
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_consumption_feed_type_id_fkey"
            columns: ["feed_type_id"]
            referencedRelation: "feed_types"
            referencedColumns: ["id"]
          }
        ]
      }
      vaccines: {
        Row: {
          id: string
          name: string
          description: string | null
          interval_days: number | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          interval_days?: number | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          interval_days?: number | null
        }
        Relationships: []
      }
      vaccination_records: {
        Row: {
          id: string
          batch_id: string
          vaccine_id: string
          date: string
          notes: string | null
          next_scheduled_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          batch_id: string
          vaccine_id: string
          date: string
          notes?: string | null
          next_scheduled_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          batch_id?: string
          vaccine_id?: string
          date?: string
          notes?: string | null
          next_scheduled_date?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vaccination_records_batch_id_fkey"
            columns: ["batch_id"]
            referencedRelation: "batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vaccination_records_vaccine_id_fkey"
            columns: ["vaccine_id"]
            referencedRelation: "vaccines"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          name: string
          type: string
          condition: string | null
          current_price: number
          price_updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          condition?: string | null
          current_price: number
          price_updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          condition?: string | null
          current_price?: number
          price_updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          id: string
          name: string
          contact_number: string | null
          address: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          contact_number?: string | null
          address?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          contact_number?: string | null
          address?: string | null
          notes?: string | null
          created_at?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          id: string
          date: string
          customer_id: string | null
          total_amount: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          date: string
          customer_id?: string | null
          total_amount: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          date?: string
          customer_id?: string | null
          total_amount?: number
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "customers"
            referencedColumns: ["id"]
          }
        ]
      }
      sale_items: {
        Row: {
          id: string
          sale_id: string
          product_id: string
          quantity: number
          price_per_unit: number
        }
        Insert: {
          id?: string
          sale_id: string
          product_id: string
          quantity: number
          price_per_unit: number
        }
        Update: {
          id?: string
          sale_id?: string
          product_id?: string
          quantity?: number
          price_per_unit?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            referencedRelation: "sales"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          date: string
          delivery_date: string
          delivery_location: string
          contact_person: string
          contact_number: string | null
          status: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          date: string
          delivery_date: string
          delivery_location: string
          contact_person: string
          contact_number?: string | null
          status: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          date?: string
          delivery_date?: string
          delivery_location?: string
          contact_person?: string
          contact_number?: string | null
          status?: string
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "customers"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_daily_egg_summary: {
        Args: {
          date_param: string
        }
        Returns: {
          total_whole_count: number
          total_broken_count: number
          small_count: number
          medium_count: number
          large_count: number
          xl_count: number
        }[]
      }
      get_monthly_sales_summary: {
        Args: {
          year_param: number
          month_param: number
        }
        Returns: {
          total_sales: number
          total_eggs_sold: number
          total_birds_sold: number
        }[]
      }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
