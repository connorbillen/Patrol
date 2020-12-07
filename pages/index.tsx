// import Head from 'next/head'
// import styles from '../styles/Home.module.css'
import dynamic from 'next/dynamic'
import React, {useState} from 'react'

import Toolbox from '../components/Toolbox'
import Tardis from '../components/Tardis'
const MapWrapper = dynamic(
  () => import('../components/MapWrapper'),
  { ssr: false }
);


export default function Home() {
  const [timeEnabled, setTimeEnabled] = useState(true);
  
  return (
    <div style={{ height: '100%' }}>
      <MapWrapper />
      <Toolbox />
      {timeEnabled && <Tardis />}
    </div>
  )
}
