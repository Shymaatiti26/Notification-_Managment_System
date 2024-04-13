
import { useAuthContext } from './useAuthComtext'

export const useLogout = () => {
    const { dispatch ,setShowChat,setSelectedGroup} = useAuthContext()
  
    const logout = () => {
      setSelectedGroup('');
      setShowChat(false);

      // remove user from storage
      localStorage.removeItem('user')
  
      // dispatch logout action
      dispatch({ type: 'LOGOUT' })
    }
  
    return { logout }
  }
  