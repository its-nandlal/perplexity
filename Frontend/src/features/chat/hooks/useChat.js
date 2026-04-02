import { useDispatch } from "react-redux";
import { initalizeSocketConnection } from "../services/chat.socket";
import { setChats, setCurrentChatId, setIsLoading, setError, addNewMessage, createNewChat } from "../chat.slice";
import { sendMessage, getChat, getMessages, deleteChat } from "../services/chat.api";

export const useChat = () => {

  const dispatch = useDispatch()

  async function handleSendMessage({message, chatId}) {
    try {
      dispatch(setIsLoading(true))
      const data = await sendMessage({message, chatId})
      const { chat, aiMessage } = data
      
      dispatch(createNewChat({
        chatId: chat._id,
        title: chat.title
      }))

      dispatch(addNewMessage({
        chatId: chat._id,
        content: message,
        role: 'user'
      }))

      dispatch(addNewMessage({
        chatId: chat._id,
        content: aiMessage.content,
        role: aiMessage.role
      }))

      dispatch(setCurrentChatId(chat._id))
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed chat'))
    } finally { dispatch(setIsLoading(false)) }
  }

  async function handleGetChats() {
    try {
      dispatch(setIsLoading(true))
      const data = await getChat();
      dispatch(setChats(data.chats))
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed geting chats'))
    } finally { dispatch(setIsLoading(false)) }

  }

  return {
    initalizeSocketConnection,
    handleSendMessage,
    handleGetChats
  };
};
