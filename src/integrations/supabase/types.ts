export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          created_at: string
          customer_id: string
          doctor_id: string | null
          id: string
          notes: string | null
          pet_name: string
          status: string
          visit_type: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          created_at?: string
          customer_id: string
          doctor_id?: string | null
          id?: string
          notes?: string | null
          pet_name: string
          status?: string
          visit_type?: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          created_at?: string
          customer_id?: string
          doctor_id?: string | null
          id?: string
          notes?: string | null
          pet_name?: string
          status?: string
          visit_type?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_type: string
          quantity: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          quantity?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          quantity?: number
          user_id?: string
        }
        Relationships: []
      }
      food_products: {
        Row: {
          animal_type: string
          brand: string
          category: string
          created_at: string
          description: string
          id: string
          image_url: string | null
          is_available: boolean
          name: string
          owner_id: string
          price: number
          tag: string | null
          updated_at: string
          weight: string | null
        }
        Insert: {
          animal_type?: string
          brand?: string
          category: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          is_available?: boolean
          name: string
          owner_id: string
          price?: number
          tag?: string | null
          updated_at?: string
          weight?: string | null
        }
        Update: {
          animal_type?: string
          brand?: string
          category?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          is_available?: boolean
          name?: string
          owner_id?: string
          price?: number
          tag?: string | null
          updated_at?: string
          weight?: string | null
        }
        Relationships: []
      }
      medicines: {
        Row: {
          animal_type: string
          category: string
          created_at: string
          description: string
          dosage: string | null
          id: string
          image_url: string | null
          is_available: boolean
          name: string
          owner_id: string
          prescription_required: boolean
          price: number
          updated_at: string
        }
        Insert: {
          animal_type?: string
          category: string
          created_at?: string
          description?: string
          dosage?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          name: string
          owner_id: string
          prescription_required?: boolean
          price?: number
          updated_at?: string
        }
        Update: {
          animal_type?: string
          category?: string
          created_at?: string
          description?: string
          dosage?: string | null
          id?: string
          image_url?: string | null
          is_available?: boolean
          name?: string
          owner_id?: string
          prescription_required?: boolean
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          item_id: string
          item_name: string
          item_type: string
          order_id: string
          price: number
          quantity: number
        }
        Insert: {
          id?: string
          item_id: string
          item_name: string
          item_type: string
          order_id: string
          price?: number
          quantity?: number
        }
        Update: {
          id?: string
          item_id?: string
          item_name?: string
          item_type?: string
          order_id?: string
          price?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          status: string
          total: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          total?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          total?: number
          user_id?: string
        }
        Relationships: []
      }
      pet_health_records: {
        Row: {
          health_score: number
          id: string
          notes: string | null
          pet_id: string
          recorded_at: string
          recorded_by: string | null
          weight_kg: number | null
        }
        Insert: {
          health_score?: number
          id?: string
          notes?: string | null
          pet_id: string
          recorded_at?: string
          recorded_by?: string | null
          weight_kg?: number | null
        }
        Update: {
          health_score?: number
          id?: string
          notes?: string | null
          pet_id?: string
          recorded_at?: string
          recorded_by?: string | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_health_records_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          age: string
          breed: string
          category: string
          certificate_id: string | null
          certified: boolean
          created_at: string
          description: string
          health_status: string
          id: string
          image_url: string | null
          is_available: boolean
          name: string
          owner_id: string
          price: number
          species: string
          temperament: string | null
          updated_at: string
          vaccinated: boolean
        }
        Insert: {
          age?: string
          breed: string
          category: string
          certificate_id?: string | null
          certified?: boolean
          created_at?: string
          description?: string
          health_status?: string
          id?: string
          image_url?: string | null
          is_available?: boolean
          name: string
          owner_id: string
          price?: number
          species: string
          temperament?: string | null
          updated_at?: string
          vaccinated?: boolean
        }
        Update: {
          age?: string
          breed?: string
          category?: string
          certificate_id?: string | null
          certified?: boolean
          created_at?: string
          description?: string
          health_status?: string
          id?: string
          image_url?: string | null
          is_available?: boolean
          name?: string
          owner_id?: string
          price?: number
          species?: string
          temperament?: string | null
          updated_at?: string
          vaccinated?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vet_locations: {
        Row: {
          address: string | null
          clinic_name: string
          created_at: string
          doctor_id: string
          id: string
          latitude: number
          longitude: number
          phone: string | null
        }
        Insert: {
          address?: string | null
          clinic_name: string
          created_at?: string
          doctor_id: string
          id?: string
          latitude: number
          longitude: number
          phone?: string | null
        }
        Update: {
          address?: string | null
          clinic_name?: string
          created_at?: string
          doctor_id?: string
          id?: string
          latitude?: number
          longitude?: number
          phone?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "customer" | "owner" | "doctor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["customer", "owner", "doctor"],
    },
  },
} as const
