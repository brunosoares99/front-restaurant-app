import Head from 'next/head';
import { Header } from '../../components/Header';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { FiRefreshCcw } from 'react-icons/fi'
import styles from './styles.module.scss';
import { setupAPIClient } from '../../services/api';
import { useState } from 'react';

import Modal from 'react-modal';
import { ModalOrder } from '../../components/ModalOrder';

type OrderProps = {
  id: string;
  table: string | number;
  status: boolean;
  draft: boolean;
  name: string | null
}

interface HomeProps {
  orders: OrderProps[];
}

export type OrderItemprops = {
  id: string;
  amount: number;
  order_id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    banner: string
  }
  order: {
    id: string;
    table: string | number;
    status: boolean;
    name: string | null
  }
}


export default function Dashboard({ orders }: HomeProps) {
  const [orderList, setOrderList] = useState(orders || [])
  const [modalItem, setModalItem] = useState<OrderItemprops[]>()
  const [modalVisible, setModalVisible] = useState(false)

  function handleCloseModal() {
    setModalVisible(false)
  }

  async function handleOpenModalView(id: string) {
    const apiClient = setupAPIClient();
    const response = await apiClient.get('/order/detail', {
      params:{
        order_id: id
      }
    })
    setModalItem(response.data.orders)
    setModalVisible(true);
  }

  async function handleFinishItem(id: string) {
    if(!id) return
    const apiClient = setupAPIClient();
    await apiClient.put('/order/done', {
      order_id: id
    });

    const response = await apiClient.get('/order');
    
    setOrderList(response.data.orders);

    setModalVisible(false);

  }

  async function handleRefreshOrders() {
    const apiClient = setupAPIClient();

    const response = await apiClient.get('/order')
    setOrderList(response.data.orders)
    
  }

  Modal.setAppElement('#__next')

  return(
    <>
    <Head>
      <title>Painel - App Restaurant</title>
    </Head>
    <div>
      <Header />
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <h1>Últimos pedidos</h1>
          <button onClick={handleRefreshOrders}>
            <FiRefreshCcw size={25} color="#3fffa3" />
          </button>
        </div>
        <article className={styles.listOrders}>

          {orderList.length === 0 && (
            <span className={styles.emptyList}>
              Nenhum pedido em aberto
            </span>
          )}

          {orderList?.map( item => (
            <section key={item.id} className={styles.orderItem}>
              <button onClick={()=> handleOpenModalView(item.id) }>
                <div className={styles.tag}></div>
                <span>Mesa {item.table}</span>
              </button>
            </section>
          ))}
        </article>
      </main>
      { modalVisible && (
        <ModalOrder 
          isOpen={modalVisible}
          OnRequestClose={handleCloseModal}
          orders={modalItem}
          handleFinishItem={handleFinishItem}
          />
      )}
    </div>
    </>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx)=> {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get('/order');


  return{
    props: response.data
  }
})