import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { Navigate } from "react-router"


export default function Protected({ children }) {

  const { user, loading, error } = useSelector(state => state.auth)

  if(loading){
    return (
      <div className=" fixed inset-0 bg-black text-white w-full h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  if(!user) {
    toast.error(error || "Invalied request first login.")
    return <Navigate to="/login" replace />
  }


  return children;
}
