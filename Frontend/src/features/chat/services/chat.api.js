import { api } from "@/lib/provider/axios";



export async function sendMessage ({ message, chatId }) {
    const response = await api.post('/api/chats/message', {message, chatId});
    return response.data;
}

export async function getChat() {
    const response = await api.get('/api/chats');
    return response.data;
}

export async function getMessages(chatId) {
    const response = await api.get(`/api/${chatId}/messages`)
    return response.data;
}

export async function deleteChat(chatId) {
    const response = await api.delete(`/api/delete/${chatId}`)
    return response.data;
}