import { destroyCookie } from 'nookies';
import { AuthTokenError } from './../services/Errors/AuthTokenError';
import { parseCookies } from 'nookies';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
export function canSSRAuth<P>(fn: GetServerSideProps<P>) {
  return async(ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);

    const token = cookies['@nextauth.token'];
    if(!token) {
      return{
        redirect:{
          destination: '/',
          permanent: false
        }
      }
    }

    try {
      return await fn(ctx);
    } catch (error) {
      if(error instanceof AuthTokenError) {
        destroyCookie(ctx, '@nextauth.token')
        return{
          redirect:{
            destination: '',
            permanent: false
          }
        }
      }
    }
    
  }
}