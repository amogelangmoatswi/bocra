import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "BOCRA Account",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
          
          if (!supabaseUrl || !supabaseKey) {
            console.error("Missing Supabase credentials for Auth");
            return null;
          }

          // Initialize pure Supabase Client (No SSR cookie logic needed here)
          const supabase = createClient(supabaseUrl, supabaseKey, {
            auth: {
              persistSession: false, // Don't try to store the session locally on the server
            }
          });

          // 1. Sign in to verify email & password
          const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: credentials.email as string,
            password: credentials.password as string,
          });

          if (authError || !authData.user) {
            console.error("Supabase Login verify error:", authError);
            return null;
          }

          const user = authData.user;

          // 2. Fetch the profile role using the authenticated user's session
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role, full_name')
            .eq('id', user.id)
            .single();

          if (profileError) {
            console.error("[NextAuth] Profile fetch error:", profileError.message);
          }

          let role = profile?.role || "user";
          let name = profile?.full_name?.trim() || user.email?.split('@')[0] || "User";

          console.log(`[NextAuth] Successful login for ${user.email}. Role determined as: ${role}`);

          return {
            id: user.id,
            email: user.email,
            name: name,
            role: role,
          };
        } catch (error) {
          console.error("Supabase auth wrapper error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role ?? "user";
        token.id = user.id;
      }
      // Handle manual session updates if needed
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        Object.assign(session.user, { role: token.role, id: token.id || token.sub });
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
