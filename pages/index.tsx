import Head from 'next/head'
import dynamic from 'next/dynamic';
import styles from '../styles/Home.module.css'

const MapWrapper = dynamic(
  () => import('../components/MapWrapper'),
  { ssr: false }
);


export default function Home() {
  return (
    <MapWrapper />
  )
}
