import Header from '@/components/Header'
import React from 'react'
import TournamentsTable from './components/TournamentsTable'

function page() {
  return (
    <div>
        <Header></Header>
        <TournamentsTable></TournamentsTable>
    </div>
  )
}

export default page