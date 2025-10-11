import AccountPage from '../AccountPage'

export default function AccountPageExample() {
  return (
    <AccountPage 
      queriesUsed={47} 
      queriesLimit={100} 
      planName="Free" 
      planExpiry="N/A" 
    />
  )
}
