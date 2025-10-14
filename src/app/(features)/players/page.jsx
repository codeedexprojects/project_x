import Header from '@/components/Header'
import React from 'react'
import PlayersTable from './components/PlayersTable'

function page() {
  return (
    <div>
        <Header></Header>
        <PlayersTable></PlayersTable>
    </div>
  )
}

export default page