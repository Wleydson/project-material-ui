import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios'

import 
{
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button
}
from '@material-ui/core'

import { TarefasToolbar, TarefasTable } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const URL_API = 'https://minhastarefas-api.herokuapp.com/tarefas'
const EMAIL= 'email_user_signIn';

const TarefaList = () => {
  const classes = useStyles();

  const [tarefas, setTarefas] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    search()
  }, [])

  const salvar = (tarefa) =>{
      axios.post(URL_API, tarefa, {
        headers:  { 'x-tenant-id' : localStorage.getItem(EMAIL) }
      }).then(response =>{
        const novaTarefa = response.data  
        setTarefas( [ ...tarefas, novaTarefa ] )
        abrirDialogMensagem('Item salvo com sucesso !')
      }).catch(error =>{
        abrirDialogMensagem('Ocorreu um erro ao salvar')
      })
  }

  const abrirDialogMensagem = (mensagem) =>{
      setMensagem(mensagem)
      setOpenDialog(true)
  }

  const search = () =>{
    axios.get(URL_API, {
      headers:  { 'x-tenant-id' : localStorage.getItem(EMAIL) }
    }).then( response =>{
      const list = response.data
      setTarefas(list)
    }).catch(error =>{
      abrirDialogMensagem("Erro ao realizar a pesquisa")
    })
  }

  const alterarStatus = (id) =>{
      axios.patch(`${URL_API}/${id}`, null, {
        headers:  { 'x-tenant-id' : localStorage.getItem(EMAIL) }
      }).then(response => {
        const list = [...tarefas]
        list.forEach(tarefa =>{
          if(tarefa.id === id){
            tarefa.done = true
          }
        })
        setTarefas(list)
        abrirDialogMensagem("Item atualizado com sucesso !")
      }).catch(error => {
        abrirDialogMensagem("Erro ao alterar o status")
      })
  }

  const deletar = (id) =>{
    axios.delete(`${URL_API}/${id}`, {
      headers:  { 'x-tenant-id' : localStorage.getItem(EMAIL) }
    }).then(response => {
      const list = tarefas.filter( tarefa => tarefa.id !== id)
      setTarefas(list)
      abrirDialogMensagem("Item removido com sucesso !")
    }).catch(error => {
      abrirDialogMensagem("Erro ao deletar")
    })
  }

  return (
    <div className={classes.root}>
      <TarefasToolbar salvar={salvar} />
      <div className={classes.content}>
        <TarefasTable tarefas={tarefas} 
                      alterarStatus={alterarStatus} 
                      deletar={deletar}
        />
      </div>

      <Dialog open={openDialog} onClose={e => setOpenDialog(false)}>
          <DialogTitle>Atenção</DialogTitle>
          <DialogContent>{mensagem}</DialogContent>
          <DialogActions>
            <Button onClick={e => setOpenDialog(false)}>Fechar</Button>
          </DialogActions>
      </Dialog>
    </div>
  );
};

export default TarefaList;
