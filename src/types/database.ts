export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      blog_follows: {
        Row: {
          blog_id: string
          created_at: string
          user_id: string
        }
        Insert: {
          blog_id: string
          created_at?: string
          user_id: string
        }
        Update: {
          blog_id?: string
          created_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_follows_blog_id_fkey"
            columns: ["blog_id"]
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_follows_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      blogs: {
        Row: {
          author: string
          banner_url: string | null
          bio: string | null
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          author: string
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          id: string
          name: string
          slug: string
        }
        Update: {
          author?: string
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "blogs_author_fkey"
            columns: ["author"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      comment_dislikes: {
        Row: {
          comment_id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          user_id: string
        }
        Update: {
          comment_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_dislikes_comment_id_fkey"
            columns: ["comment_id"]
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_dislikes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      comment_likes: {
        Row: {
          comment_id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          user_id: string
        }
        Update: {
          comment_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comment_likes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      comments: {
        Row: {
          author: string
          comment: string
          created_at: string
          id: string
          last_dislike_count: number | null
          last_like_count: number | null
          last_metric_update: string
        }
        Insert: {
          author: string
          comment: string
          created_at?: string
          id: string
          last_dislike_count?: number | null
          last_like_count?: number | null
          last_metric_update?: string
        }
        Update: {
          author?: string
          comment?: string
          created_at?: string
          id?: string
          last_dislike_count?: number | null
          last_like_count?: number | null
          last_metric_update?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_fkey"
            columns: ["author"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      post_dislikes: {
        Row: {
          post_id: string
          user_id: string
        }
        Insert: {
          post_id: string
          user_id: string
        }
        Update: {
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_dislikes_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_dislikes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      post_likes: {
        Row: {
          post_id: string
          user_id: string
        }
        Insert: {
          post_id: string
          user_id: string
        }
        Update: {
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
      posts: {
        Row: {
          author: string
          blog_id: string | null
          content: string
          created_at: string
          description: string | null
          id: string
          last_dislike_count: number | null
          last_like_count: number | null
          last_metric_update: string
          last_view_count: number | null
          slug: string
          title: string
        }
        Insert: {
          author: string
          blog_id?: string | null
          content: string
          created_at?: string
          description?: string | null
          id: string
          last_dislike_count?: number | null
          last_like_count?: number | null
          last_metric_update?: string
          last_view_count?: number | null
          slug: string
          title: string
        }
        Update: {
          author?: string
          blog_id?: string | null
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          last_dislike_count?: number | null
          last_like_count?: number | null
          last_metric_update?: string
          last_view_count?: number | null
          slug?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_fkey"
            columns: ["author"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_blog_id_fkey"
            columns: ["blog_id"]
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          }
        ]
      }
      tags: {
        Row: {
          id: string
        }
        Insert: {
          id: string
        }
        Update: {
          id?: string
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string
          followee_id: string
          folower_id: string
        }
        Insert: {
          created_at?: string
          followee_id: string
          folower_id: string
        }
        Update: {
          created_at?: string
          followee_id?: string
          folower_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_follows_followee_id_fkey"
            columns: ["followee_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_follows_folower_id_fkey"
            columns: ["folower_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          banner_url: string | null
          bio: string | null
          created_at: string
          id: string
          name: string
          profile_pic: string | null
          username: string
        }
        Insert: {
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          id: string
          name: string
          profile_pic?: string | null
          username: string
        }
        Update: {
          banner_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          name?: string
          profile_pic?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
