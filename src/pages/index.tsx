import Head from "next/head";
import styles from "../../styles/Home.module.scss";


import logoImg from "../../public/logo.svg";
import Image from "next/image";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button"

export default function Home() {
  return (
   <>
   <Head>
     <title>App Restaurant - Faça seu login</title>
   </Head>
   <div className={styles.containerCenter}>
     <Image src={logoImg} alt="Logo app restaurant" />

     <div className={styles.login}>
       <form>
         <Input placeholder="Digite seu email" type="text" />
         <Input placeholder="Digite seu email" type="password"/>
         <Button type="submit" loading={false}>
           Cadastrar
         </Button>
       </form>

       <a className={styles.text}>Não Possui uma conta? <u>cadastre-se</u></a>

     </div>
   </div>
   </>
  )
}
