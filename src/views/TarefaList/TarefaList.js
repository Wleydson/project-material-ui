import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios'

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
const headers = { 'x-tenant-id' : 'wleydson@email.com' }
const TarefaList = () => {
  const classes = useStyles();

  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    search()
  }, [])

  const salvar = (tarefa) =>{
      axios.post(URL_API, tarefa, {
        headers: headers
      }).then(response =>{
        const novaTarefa = response.data  
        setTarefas( [ ...tarefas, novaTarefa ] )
      }).catch(error =>{
        console.log(error)
      })
  }

  const search = () =>{
    axios.get(URL_API, {
      headers: headers
    }).then( response =>{
      const list = response.data
      setTarefas(list)
    }).catch(error =>{
      console.log(error)
    })
  }

  const alterarStatus = (id) =>{
      axios.patch(`${URL_API}/${id}`, null, {
        headers: headers
      }).then(response => {
        const list = [...tarefas]
        list.forEach(tarefa =>{
          if(tarefa.id === id){
            tarefa.done = true
          }
        })
        setTarefas(list)
      }).catch(error => {
        console.log(error)
      })
  }

  const deletar = (id) =>{
    axios.delete(`${URL_API}/${id}`, {
      headers: headers
    }).then(response => {
      const list = tarefas.filter( tarefa => tarefa.id !== id)
      setTarefas(list)
    }).catch(error => {
      console.log(error)
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
    </div>
  );
};

export default TarefaList;
