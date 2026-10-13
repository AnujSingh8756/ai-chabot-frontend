import api from '../../utils/axios'

async function logOut() {
    try {
        const { data } = await api.get("/api/auth/logout")
        return data
    } catch (error) {
        console.error("logOut error:", error)
        return null
    }
}

export { logOut }
export default logOut