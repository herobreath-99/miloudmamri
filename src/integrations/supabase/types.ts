export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      completed_exercises: {
        Row: {
          completed_at: string;
          duration_seconds: number | null;
          exercise_key: string;
          id: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string;
          duration_seconds?: number | null;
          exercise_key: string;
          id?: string;
          user_id: string;
        };
        Update: {
          completed_at?: string;
          duration_seconds?: number | null;
          exercise_key?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      daily_reminders: {
        Row: {
          completed_at: string;
          completed_date: string;
          id: string;
          reminder_key: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string;
          completed_date?: string;
          id?: string;
          reminder_key: string;
          user_id: string;
        };
        Update: {
          completed_at?: string;
          completed_date?: string;
          id?: string;
          reminder_key?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      mood_logs: {
        Row: {
          energy_level: number | null;
          id: string;
          logged_at: string;
          logged_date: string;
          mood: string;
          user_id: string;
          wellness_level: number | null;
        };
        Insert: {
          energy_level?: number | null;
          id?: string;
          logged_at?: string;
          logged_date?: string;
          mood: string;
          user_id: string;
          wellness_level?: number | null;
        };
        Update: {
          energy_level?: number | null;
          id?: string;
          logged_at?: string;
          logged_date?: string;
          mood?: string;
          user_id?: string;
          wellness_level?: number | null;
        };
        Relationships: [];
      };
      notification_log: {
        Row: {
          body: string;
          category: string;
          fired_at: string;
          id: string;
          status: string;
          title: string;
          user_id: string;
        };
        Insert: {
          body: string;
          category: string;
          fired_at?: string;
          id?: string;
          status?: string;
          title: string;
          user_id: string;
        };
        Update: {
          body?: string;
          category?: string;
          fired_at?: string;
          id?: string;
          status?: string;
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      notification_settings: {
        Row: {
          adaptive: Json;
          categories: Json;
          created_at: string;
          enabled: boolean;
          last_dispatched: Json;
          permission_granted: boolean;
          quiet_end: string;
          quiet_start: string;
          snooze_minutes: number;
          timezone: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          adaptive?: Json;
          categories?: Json;
          created_at?: string;
          enabled?: boolean;
          last_dispatched?: Json;
          permission_granted?: boolean;
          quiet_end?: string;
          quiet_start?: string;
          snooze_minutes?: number;
          timezone?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          adaptive?: Json;
          categories?: Json;
          created_at?: string;
          enabled?: boolean;
          last_dispatched?: Json;
          permission_granted?: boolean;
          quiet_end?: string;
          quiet_start?: string;
          snooze_minutes?: number;
          timezone?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          age: number | null;
          avatar_url: string | null;
          created_at: string;
          email: string | null;
          first_name: string | null;
          id: string;
          last_name: string | null;
          updated_at: string;
        };
        Insert: {
          age?: number | null;
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          first_name?: string | null;
          id: string;
          last_name?: string | null;
          updated_at?: string;
        };
        Update: {
          age?: number | null;
          avatar_url?: string | null;
          created_at?: string;
          email?: string | null;
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      push_subscriptions: {
        Row: {
          auth: string;
          created_at: string;
          endpoint: string;
          id: string;
          last_used_at: string;
          p256dh: string;
          user_agent: string | null;
          user_id: string;
        };
        Insert: {
          auth: string;
          created_at?: string;
          endpoint: string;
          id?: string;
          last_used_at?: string;
          p256dh: string;
          user_agent?: string | null;
          user_id: string;
        };
        Update: {
          auth?: string;
          created_at?: string;
          endpoint?: string;
          id?: string;
          last_used_at?: string;
          p256dh?: string;
          user_agent?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      symptoms: {
        Row: {
          id: string;
          logged_at: string;
          notes: string | null;
          severity: number;
          symptom_type: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          logged_at?: string;
          notes?: string | null;
          severity?: number;
          symptom_type: string;
          user_id: string;
        };
        Update: {
          id?: string;
          logged_at?: string;
          notes?: string | null;
          severity?: number;
          symptom_type?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
