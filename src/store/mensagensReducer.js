
const INIT_STATE = {
    openDialog: false,
    mensagem: ''
}

export const ACTIONS = {
    MOSTRAR_MENSAGENS: 'MENSAGENS_MOSTRAR',
    ESCONDER_MENSAGENS: 'MENSAGENS_ESCONDER'
}

export function mensagensReducer(state = INIT_STATE,action){
    switch(action.type){
        case ACTIONS.MOSTRAR_MENSAGENS:
            return{ ...state, mensagem: action.mensagem, openDialog: true}
        case ACTIONS.ESCONDER_MENSAGENS:
            return{...state, mensagem:'', openDialog: false}
        default:
            return state
    }
}

export function mostrarMensagem(mensagem){
    return{
        type: ACTIONS.MOSTRAR_MENSAGENS,
        mensagem: mensagem
    }
}

export function esconderMensagem(){
    return { type: ACTIONS.ESCONDER_MENSAGENS }
}

