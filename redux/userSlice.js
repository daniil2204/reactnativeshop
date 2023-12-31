import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { makeRequest } from '../utils/graphqlRequest' 
import { checkPayload } from "../utils/checkPayload";
import SyncStorage from 'sync-storage';




const initialState = {
    data: {
        bucket:[],
        desireItems:[]
    },
    loading: false,
    auth: false,
    isItemPage: false,
}

const saveTokenInLocal = (token) => {
    SyncStorage.set('token', token);
}


export const login = createAsyncThunk('user/login', async (params) => {
    const {email,password} = params;
    const login = `mutation login{
        login(email:"${email}",password:"${password}"){
            id
            email
            username
            role
            token
            phone
            bucket{
                price
                count
                itemId
                imageUrl
                title
            }
            desireItems {
                itemId
                price
                imageUrl
                title
            }
        }
    }`
    const data = await makeRequest(login);
    saveTokenInLocal(data.data.login.token)
    return data;

})

export const register = createAsyncThunk('user/register', async (params) => {
    const {email,username,password,phone} = params;
    const register = `mutation register{
        register(username:"${username}",email:"${email}",password:"${password}",phone:"${phone}"){
            id
            email
            role
            username
            phone
            token
            bucket{
                price
                count
                itemId
                imageUrl
                title
            }
            desireItems {
                itemId
                price
                imageUrl
                title
            }
        }
      }`
    
    const data = await makeRequest(register);
    saveTokenInLocal(data.data.register.token)
    return data;
})


export const getMe = createAsyncThunk('user/getMe', async (token) => {
    const user = `query getMe{
        getMe{
            id
            email
            role
            username
            phone
            token
            bucket{
                price
                count
                itemId
                imageUrl
                title
            }
            desireItems {
                itemId
                price
                imageUrl
                title
            }
        }
    }`
    const data = await makeRequest(user,token);
    return data;
})


const userSlice = createSlice({
    name:'user',
    initialState,
    reducers: {
        logOut(state) {
            state.data = {
                bucket:[],
                desireItems:[]
            };
            state.auth = false;
            state.isItemPage = false;
            state.loading = false;
        },
        changeItemCountInBucket(state,action) {
            const {id,price,count,imageUrl,operation,title} = action.payload;
            if (count !== 1 || operation === '-') {
                state.data.bucket = [...state.data.bucket.map(item => {
                    item.itemId === id ? item = {
                        ...item,
                        count,
                        price,
                    } : item;
                    return item;
                })]
            }else{
                state.data.bucket = [...state.data.bucket,{
                    itemId:id,
                    count,
                    imageUrl,
                    price,
                    title,
                }]
            }
        },
        deleteItemFromBucket(state,action) {
            state.data.bucket = [...state.data.bucket.filter(item => item.itemId !== action.payload)]
        },
        addItemToDesire(state,action) {
            state.data.desireItems = [...state.data.desireItems,action.payload];
        },
        remoweItemFromDesire(state,action) {
            state.data.desireItems = [...state.data.desireItems.filter(item => item.itemId !== action.payload)];
        },
        setIsItemPage(state,action) {
            state.isItemPage = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            state.loading = true;
        }),
        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            if (checkPayload(action.payload)) {
                state.data = action.payload.data.login;        
                state.auth = true;
            }           
        }),
        builder.addCase(register.pending, (state) => {
            state.loading = true;
        }),
        builder.addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            if (checkPayload(action.payload)) {
                state.data = action.payload.data.register;        
                state.auth = true;
            }           
        }),
        builder.addCase(getMe.pending, (state) => {
            state.loading = true;
        }),
        builder.addCase(getMe.fulfilled, (state, action) => {
            state.loading = false;
            if (checkPayload(action.payload)) {
                state.data = action.payload.data.getMe;        
                state.auth = true;
            }           
        })
      },
});

export const { logOut,deleteItemFromBucket,changeItemCountInBucket,findCountItemInBucket,addItemToDesire,setIsItemPage,remoweItemFromDesire } = userSlice.actions;
export default userSlice.reducer;



// let title = 'test form native';
//     let price = 345;
//     let imageUrl = 'gfgsdf';
//     let category = ["test","test"];
//     const test2 = `mutation addItem {
//         addItem(title:"${title}",price:${price},imageUrl:"${imageUrl}",category:"${category}"){
//             title
//             price
//       }
//     }`
