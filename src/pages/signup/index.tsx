import Head from "next/head";
import styles from "../../../styles/Home.module.scss";


import logoImg from "../../../public/logo.svg";
import Image from "next/image";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

import Link from 'next/link';
import { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

export default function SignUp() {
  const { signUp } = useContext(AuthContext)

  const [ name, setName ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const [ loading, setLoading ] = useState(false)

  async function handleSignUp(event: FormEvent) {
    event.preventDefault();
    if(name === '' || email === '' || password === '') {
      toast.warn("Por favor, Preencha todos os campos!")
      return
    }  

    setLoading(true)

    let data = {
      name,
      email,
      password
    }
    await signUp(data)

    setLoading(false)
  }

  return (
   <>
   <Head>
     <title>Faça seu cadastro agora!</title>
   </Head>
   <div className={styles.containerCenter}>
     <Image src={logoImg} alt="Logo app restaurant" />

     <div className={styles.login}>
       <h1>Criando sua conta</h1>
       <form onSubmit={handleSignUp}>
         <Input 
          placeholder="Nome" 
          type="text"
          value={name} 
          onChange={(e) => {setName(e.target.value)}}  />
         <Input 
          placeholder="Email" 
          type="text"
          value={email} 
          onChange={(e) => {setEmail(e.target.value)}} />
         <Input 
         placeholder="Senha" 
         type="password"
         value={password} 
         onChange={(e) => {setPassword(e.target.value)}}/>
         <Button 
          type="submit" 
          loading={loading}>
           Cadastrar
         </Button>
       </form>

      <Link href="/" >
        <a className={styles.text}>Já Possui uma conta? Faça login</a>
      </Link>

     </div>
   </div>
   </>
  )
}
