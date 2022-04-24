import { FormEvent, useContext, useState } from 'react'


import Head from "next/head";
import styles from "../../styles/Home.module.scss";


import logoImg from "../../public/logo.svg";
import Image from "next/image";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

import Link from 'next/link';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { GetServerSideProps } from 'next';
import { canSSRGuest } from '../utils/canSSRGuest';

export default function Home() {
  const { signIn } = useContext(AuthContext)
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  
  const [ loading, setLoading ] = useState(false)

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    let data = {
      email,
      password
    }
    if(email === '' || password === ''){
      toast.warn("Por favor, Preencha todos os campos!")
      return
    } 
    setLoading(true)
    await signIn(data);
    setLoading(false)
  }

  return (
   <>
   <Head>
     <title>App Restaurant - Faça seu login</title>
   </Head>
   <div className={styles.containerCenter}>
     <Image src={logoImg} alt="Logo app restaurant" />

     <div className={styles.login}>
      <h1>Faça seu login</h1>
      <form onSubmit={handleLogin}>
        <Input 
          placeholder="Email" 
          type="text" 
          value={email} 
          onChange={(e) => {setEmail(e.target.value)}} 
        />
        <Input 
          placeholder="Senha" 
          type="password"
          value={password} 
          onChange={(e) => {setPassword(e.target.value)}} 
          />
        <Button type="submit" loading={loading}>
          Acessar
        </Button>
      </form>

      <Link href="/signup" >
        <a className={styles.text}>Não Possui uma conta? cadastre-se</a>
      </Link>

     </div>
   </div>
   </>
  )
}

export const getServerSideProps = canSSRGuest(async ()=> {
  return {
    props:{}
  }
});