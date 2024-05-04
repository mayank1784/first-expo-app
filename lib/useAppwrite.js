import {useEffect, useState} from 'react'
import { Alert } from 'react-native'

const useAppwrite = (fn) => {
    const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

 
    const fetchData = async ()=> {
      setIsLoading(true)
      try {
        const response = await fn()
        setData(response)
      } catch (error) {
        Alert.alert("error", error.message)
      }finally{
        setIsLoading(false)
      }
    }
  useEffect(()=>{
    fetchData()
    console.log(data)
  },[])

  const refetch = () => fetchData()

return {data, isLoading, refetch}
}

export default useAppwrite