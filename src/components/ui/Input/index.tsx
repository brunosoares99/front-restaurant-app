import styles from './styles.module.scss'
import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{}
interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>{}

export function Input({...rest}: InputProps){
  return (
    <input {...rest} className={styles.input} type="text" />
  )
}

export function TextArea({...rest}: TextAreaProps){
  return (
    <textarea className={styles.input} {...rest}></textarea>
  )
}