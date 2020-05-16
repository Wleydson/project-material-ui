import axios from 'axios'
import { mostrarMensagem } from './mensagensReducer'

const http = axios.create({
    baseURL: 'https://minhastarefas-api.herokuapp.com/'
})

const EMAIL= 'email_user_signIn';

const ACTIONS = {
    LISTAR: 'TAREFAS_LISTAR',
    ADD: 'TAREFAS_ADD',
    REMOVER: 'TAREFAS_REMOVER',
    UPDATE_STATUS: 'TAREFAS_UPDATE_STATUS'
}

const INIT_STATE = {
    tarefas: [],
    quantidade: 0
}

export const tarefaReducer = (state = INIT_STATE, action) =>{ 
    switch(action.type){
        case ACTIONS.LISTAR:
            return { ...state, tarefas: action.tarefas, quantidade: countQuantidadePendente(action.tarefas) }
        case ACTIONS.ADD:
            const tarefas = [...state.tarefas, action.tarefa]
            return { ...state, tarefas: tarefas, quantidade: countQuantidadePendente(tarefas) }
        case ACTIONS.REMOVER:
            const id = action.id;
            const list = state.tarefas.filter( tarefa => tarefa.id !== id)
            return { ...state, tarefas: list, quantidade: countQuantidadePendente(list) }
        case ACTIONS.UPDATE_STATUS:
            const lista = [...state.tarefas]
            lista.forEach(tarefa => {
                if(tarefa.id === action.id){
                    tarefa.done = true
                }
            })
            return { ...state, tarefas: lista, quantidade: countQuantidadePendente(lista) }
        default:
            return state
    }
}

export function listar(){
    return dispatch => {
        http.get('/tarefas',{
            headers:  { 'x-tenant-id' : localStorage.getItem(EMAIL) }
        }).then(response => {
            dispatch({
                type: ACTIONS.LISTAR,
                tarefas: response.data
            })
        })
    }
}

export function salvar(tarefa){
    return dispatch =>{
        http.post('/tarefas', tarefa,{
            headers:  { 'x-tenant-id' : localStorage.getItem(EMAIL) }  
        }).then(response => {
            dispatch([{
                type:ACTIONS.ADD,
                tarefa: response.data
            }, mostrarMensagem('Tarefa salva com sucesso !')])
        })
    }
}

export function deletar(id){
    return dispatch =>{
        http.delete(`/tarefas/${id}`,{
            headers:  { 'x-tenant-id' : localStorage.getItem(EMAIL) }     
        }).then(response =>{
            dispatch([{
                type:ACTIONS.REMOVER,
                id: id
            }, mostrarMensagem('Tarefa removida')])
        })
    }
}

export function alterarStatus(id){
    return dispatch => {
        http.patch(`/tarefas/${id}`, null,{
            headers:  { 'x-tenant-id' : localStorage.getItem(EMAIL) }     
        }).then(response => {
            dispatch([{
                type: ACTIONS.UPDATE_STATUS,
                id: id
            }, mostrarMensagem('Tarefa resolvida !')])
        })
    }
}

function countQuantidadePendente(tarefas){
    let count = 0

    tarefas.forEach(tarefa =>{
        if(!tarefa.done){
            count++;
        }
    })

    return count;
}