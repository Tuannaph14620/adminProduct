
import { Navigate } from 'react-router-dom'
const PrivateRouter = (props) => {
  const isAdmin = JSON.parse(localStorage.getItem("user"))
  if (!isAdmin) {  
    return <Navigate to='/signin'/>
  }
  return props.children
}

export default PrivateRouter