import React, { useState } from 'react'
import {
  Form as AntdForm,
  Input as AntdInput,
  Icon as AntdIcon,
  Button as AntdButton,
  Avatar as AntdAvatar
} from 'antd'
import { useAuth } from '../../contexts/AuthProvider'
import api from '../../services/api'
import logo from '../../assets/logo.png'
import './login.less'

const STRINGS = {
  USERNAME_PLACEHOLDER: 'όνομα χρήστη',
  PASSWORD_PLACEHOLDER: 'κωδικός',
  LOGIN_BUTTON: 'Είσοδος'
}

const Login = () => {
  const auth = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(evt) {
    evt.preventDefault()
    const response = await api.post('/api/token', { username, password })
    if (response && response.token) {
      auth.signIn(response.token)
    }
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <AntdAvatar
          size={196}
          src={logo}
          alt="metis"
          className="login-avatar"
        />
        <AntdForm className="login-form-content" onSubmit={handleSubmit}>
          <AntdForm.Item>
            <AntdInput
              name="username"
              autoComplete="username"
              size="large"
              prefix={<AntdIcon type="user" />}
              placeholder={STRINGS.USERNAME_PLACEHOLDER}
              value={username}
              onChange={evt => setUsername(evt.target.value)}
            />
            <AntdInput
              name="password"
              autoComplete="password"
              type="password"
              size="large"
              prefix={<AntdIcon type="key" />}
              placeholder={STRINGS.PASSWORD_PLACEHOLDER}
              value={password}
              onChange={evt => setPassword(evt.target.value)}
            />
          </AntdForm.Item>
          <AntdButton
            type="primary"
            htmlType="submit"
            disabled={
              !(
                username &&
                username.length > 0 &&
                password &&
                password.length > 0
              )
            }>
            {STRINGS.LOGIN_BUTTON}
          </AntdButton>
        </AntdForm>
      </div>
    </div>
  )
}

export default Login
