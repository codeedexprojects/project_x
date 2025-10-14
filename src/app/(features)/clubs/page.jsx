import Header from '@/components/Header'
import React from 'react'
import ClubsTable from './components/ClubTable'

function page() {
  return (
    <div>
        <Header></Header>
        <ClubsTable></ClubsTable>
    </div>
  )
}

export default page