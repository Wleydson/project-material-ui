import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
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
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { 
  listar,
  salvar,
  deletar,
  alterarStatus
 } from '../../store/tarefasReducer'
 import { esconderMensagem } from '../../store/mensagensReducer'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const TarefaList = (props) => {
  const classes = useStyles();

  useEffect(() => {
    props.listar()
  })

  return (
    <div className={classes.root}>
      <TarefasToolbar salvar={props.salvar} />
      <div className={classes.content}>
        <TarefasTable tarefas={props.tarefas} 
                      alterarStatus={props.alterarStatus} 
                      deletar={props.deletar}
        />
      </div>

      <Dialog open={props.openDialog} onClose={props.esconderMensagem}>
          <DialogTitle>Atenção</DialogTitle>
          <DialogContent>{props.mensagem}</DialogContent>
          <DialogActions>
            <Button onClick={props.esconderMensagem}>Fechar</Button>
          </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = state => ({
  tarefas: state.tarefas.tarefas,
  mensagem: state.mensagens.mensagem,
  openDialog: state.mensagens.openDialog
})

const mapDispatchToProps = dispatch => 
  bindActionCreators({ 
    listar, 
    salvar, 
    deletar, 
    alterarStatus, 
    esconderMensagem 
  }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps) (TarefaList);
