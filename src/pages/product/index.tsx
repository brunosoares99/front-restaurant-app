import Head from 'next/head';
import { Header } from '../../components/Header';
import { canSSRAuth } from '../../utils/canSSRAuth';
import styles from './styles.module.scss';

import { FiUpload } from 'react-icons/fi'
import { ChangeEvent, ChangeEventHandler, FormEvent, useState } from 'react';
import { setupAPIClient } from '../../services/api';
import { toast } from 'react-toastify';

type ItemProps = {
  id: string;
  name: string;
}

interface CategoryProps {
  categoryList: ItemProps[];
}

export default function Product({categoryList}: CategoryProps) {
  
  const [inputKey, setInputKey] = useState('inputKey')
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('')
  
  const [avatarUrl, setAvatarUrl] = useState('');
  const [imageAvatar, setImageAvatar] = useState(null);

  const [categories, setCategories] = useState(categoryList || []);
  const [categorySelected, setCategorySelected] = useState(0);

  function handleFile(e: ChangeEvent<HTMLInputElement>){
    if(!e.target.files) return

    const image = e.target.files[0]

    if(!image) return

    if(image.type === 'image/jpeg' || image.type === 'image/png') {
      setImageAvatar(image);
      setAvatarUrl(URL.createObjectURL(image))
    }
  }

  function handleChangeCategory(event) {
    const value = event.target.value
    const indexCategory = parseInt(value)
    setCategorySelected(indexCategory)
  }

  async function handleRegisterProduct(event: FormEvent) {
    event.preventDefault();
    try {
      const data = new FormData();
      if(name === '' || price === '' || description === '' || imageAvatar === null ) {
        toast.error("Preencha todos os campos!")
        return
      }
      data.append('name', name)
      data.append('price', price)
      data.append('description', description)
      data.append('category_id', categories[categorySelected].id);
      data.append('file', imageAvatar)

      const apiClient = setupAPIClient();

      await apiClient.post('/product', data)

      toast.success('Cadastrado com sucesso!')

    } catch (error) {
      toast.error("Ops, algo deu errado, tente novamente ou contate o suporte!")
    }

    setName('');
    setPrice('');
    setDescription('');
    setImageAvatar(null);
    setAvatarUrl('');
    setCategorySelected(0)
    inputKey === '' ? setInputKey('inputKey') : setInputKey('')
    
    
  }

  return (
    <>
    <Head>
      <title>Novo produto - App Resturant</title>
    </Head>
    <div>
      <Header />

      <main className={styles.container}>
        <h1>Novo produto</h1>

        <form onSubmit={handleRegisterProduct} className={styles.form}>

          <label className={styles.labelAvatar}>
            <span>
              <FiUpload size={25} color="#fff" />
            </span>

            <input type="file" key={inputKey || ''} accept="image/png, image/jpeg" onChange={handleFile} />
              
            {avatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                className={styles.preview}
                src={avatarUrl} 
                alt="Foto do produto"
                width={250}
                height={250}
              />
            )}
          </label>

          <select value={categorySelected} onChange={handleChangeCategory}>
            {categories.map( (item,index) => {
              return(
                <option key={item.id} value={index}>
                  {item.name}
                </option>
              )
            }
            )}
          </select>
            
            <input 
              type="text" 
              placeholder='Nome do produto'
              className={styles.input}
              value={name}
              onChange={(e)=> setName(e.target.value)}
            />
            <input 
              type="text" 
              placeholder='Preço do produto'
              className={styles.input}
              value={price}
              onChange={(e)=> setPrice(e.target.value)}
            />

            <textarea 
              placeholder='Descrição do produto' 
              className={styles.input}
              value={description}
              onChange={(e)=> setDescription(e.target.value)}
            />

            <button className={styles.buttonAdd} type="submit">
              Cadastrar
            </button>

        </form>

      </main>
    </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async(ctx)=> {
  const apiClient = setupAPIClient(ctx)

  const response = await apiClient.get('/category');
  return {
    props:{
      categoryList: response.data.categories
    }
  }
})