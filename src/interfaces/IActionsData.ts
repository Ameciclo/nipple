interface IActionData {
    cd_nm_funcao: string;
    cd_nm_prog: string;
    vlrdotatualizada: number;
    vlrtotalpago: number;
    cd_nm_acao: string;
    cd_nm_subacao: string;
    vlrempenhado: number;
    vlrliquidado: number;
    cd_nm_subfuncao: string;
  }
  
  export default interface IActionsData {
    campos: IActionData[];
  }