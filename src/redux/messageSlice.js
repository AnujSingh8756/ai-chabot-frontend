import {createSlice} from "@reduxjs/toolkit"

const messageSlice=createSlice({
    name: "message",
    initialState:{
    messages:[]
    },
    reducers:{
        setMessages:(state,action)=>{
            state.messages=action.payload
        },
        addMessage:(state,action)=>{
            state.messages.push(action.payload)
        },
        setmessages:(state,action)=>{
            state.messages=action.payload
        },
        addmessages:(state,action)=>{
            state.messages.push(action.payload)
        },
    }
})
export const {setmessages, addmessages, setMessages, addMessage}=messageSlice.actions
export default messageSlice.reducer