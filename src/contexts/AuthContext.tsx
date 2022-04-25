import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../services/apiClient";

type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signUp: (credentials: SignUpProps) => Promise<void>;
  signOut: () => void;
}

type UserProps = {
  id: string;
  name: string;
  email: string;
}

type SignInProps = {
  email: string;
  password: string;
}

type SignUpProps = {
  name: string
  email: string;
  password: string;
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut() {
  try {
    destroyCookie(undefined, '@nextauth.token');
    Router.push('/')
  } catch (error) {
    console.log('erro ao deslogar')
  }
}


export function AuthProvider({children}: AuthProviderProps){
  const [user,setUser] = useState<UserProps>();
  const isAuthenticated = !!user;

  useEffect(()=> {
    const { '@nextauth.token': token } = parseCookies();
    if(token) {
      api.get('/me').then(response => {
        const { id, name, email } = response.data;
        setUser({
          id,
          name,
          email
        })
      }).catch(()=> {
        signOut()
      })
    }
  }, [])

  async function signIn({email, password}: SignInProps) {
    try {
      const response = await api.post('/session', {
        email,
        password
      })

      const { id, name, token } = response.data;

      setCookie(undefined, '@nextauth.token',token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/"
      })

      setUser({
        id,
        name,
        email
      })

      api.defaults.headers['Authorization'] = `Bearer ${token}`

      toast.success('Sessão iniciada com sucesso!')

      Router.push('/dashboard');
    } catch (error) {
      toast.error("Ops, algo deu errado, tente novamente ou contate o suporte!");
    }
  }

  async function signUp({name, email, password}: SignUpProps) {
    try {
      const response = await api.post('/users', {
        name,
        email,
        password
      })
      toast.success("Usuário criado com sucesso, agora realize seu login!")
      Router.push('/');
    } catch (error) {
      toast.error("Ops, algo deu errado, tente novamente ou contate o suporte!");
    }
  }

  return(
    <AuthContext.Provider value={{user, isAuthenticated, signIn, signUp, signOut}}>
      {children}
    </AuthContext.Provider>
  )
}