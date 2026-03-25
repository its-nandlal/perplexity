import { useDispatch } from "react-redux";
import { regster, login, getMe } from "../services/auth.api";
import { setUser, setLoading, setError, setMessage } from "../auth.slice";



export function useAuth () {
    const dispatch = useDispatch();

    async function handleRegister({username, email, password}) {
        try {
            dispatch(setLoading(true))
            const data = await regster({username, email, password})
            dispatch(setMessage(data?.message))
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Register failed!"))
        } finally { dispatch(setLoading(false)) }
    };

    async function handleLogin({email, password}) {
        try {
            dispatch(setLoading(true))
            const data = await login({email, password})
            dispatch(setMessage(data?.message))
            dispatch(setUser(data))
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Login failed!"))
        } finally { dispatch(setLoading(false)) }
    };

    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data))
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Failed to sech data!"))
        } finally { dispatch(setLoading(false)) }
    };


    return {
        handleRegister,
        handleLogin,
        handleGetMe
    };
}