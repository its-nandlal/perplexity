import { useSelector } from "react-redux"


export default function Dashboard() {

  const { user } = useSelector(state => state.auth)

  console.log(user)
  return (
    <div>
      Dashboard
    </div>
  )
}
