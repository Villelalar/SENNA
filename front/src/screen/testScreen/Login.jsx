import React from 'react'


import '../testScreen/Login.css'

const Login = () => {
  return (
    <div className="container" >

      <div className="titulo">
        <h1>TecToy</h1>
        <h5>Alredy have an account? <span>Log in</span> </h5>
      </div>

      <div className="conteudo">
        <form action="" className='formulario'>
          <input type="date" name="data" id="data" />
          <input type="text" name="nome" id="nome" placeholder='Nome'/>
          <input type="text" name="sobrenome" id="sobrenome" placeholder='Sobrenome'/>
          <input type="email" name="email" id="email" placeholder='E-mail'/>
          <input type="password" name="senha" id="senha" placeholder='Sua senha'/>
          <input type="button" value="Sign in" />

          <span>or</span>

          <input type="button" value="Sing in with Google" />
        </form>
      </div>
    </div>
  )
}

export default Login