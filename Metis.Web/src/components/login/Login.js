import React, { useState, useContext } from 'react'
import { AuthContext } from '../../auth/AuthProvider'
import {
  Form as AntdForm,
  Icon as AntdIcon,
  Input as AntdInput,
  Button as AntdButton,
  Row as AntdRow,
  Col as AntdCol,
  Typography as AntdTypography,
  Divider as AntdDivider,
  Comment as AntdComment,
  Avatar as AntdAvatar
} from 'antd'
import api from '../../services/api'
import logo from '../../assets/logo.png'
import '../../styles/Utilities.sass'
import './Login.sass'

const Login = () => {
  const authContext = useContext(AuthContext)
  const [loginModel, setLoginModel] = useState({
    username: '',
    password: ''
  })

  const inputsHandler = e => {
    setLoginModel({
      ...loginModel,
      [e.target.name]: e.target.value
    })
  }

  const clearUsernameHandler = () => {
    setLoginModel({ ...loginModel, username: '' })
  }

  const loginHandler = async () => {
    const res = await api.post('/api/token', loginModel)

    if (res && res.token) {
      authContext.signIn(res.token)
    }
  }

  const clearButton = loginModel.username && (
    <AntdIcon type="close-circle" onClick={clearUsernameHandler} />
  )

  return (
    <AntdRow
      className="is-fullheight"
      type="flex"
      justify="center"
      align="middle">
      <AntdCol
        xs={{ span: 0 }}
        md={{ span: 11 }}
        xl={{ span: 7 }}
        xxl={{ span: 5 }}>
        <AntdComment
          author={
            <AntdTypography.Title className="metis-title" level={4}>
              Metis
            </AntdTypography.Title>
          }
          avatar={<AntdAvatar size={124} src={logo} alt="TODO" />}
          content={
            <p className="content-fix">
              Some text that they will propably provide for use about the
              application. Otherwise some basic info about what this application
              does.
            </p>
          }
        />
      </AntdCol>
      <AntdCol xs={{ span: 0 }} md={{ span: 1 }} className="has-text-centered">
        <AntdDivider type="vertical" className="divider" />
      </AntdCol>

      <AntdCol
        xs={{ span: 21 }}
        md={{ span: 11 }}
        xl={{ span: 7 }}
        xxl={{ span: 5 }}>
        <AntdForm>
          <AntdTypography.Title className="mb-5" level={2}>
            Σύνδεση
          </AntdTypography.Title>
          <AntdForm.Item>
            <AntdInput
              placeholder="Συμπληρώστε όνομα χρήστη"
              size="large"
              name="username"
              autoComplete="username"
              prefix={<AntdIcon type="user" />}
              suffix={clearButton}
              className="has-text-dark"
              value={loginModel.username}
              onChange={inputsHandler}
            />
          </AntdForm.Item>
          <AntdForm.Item>
            <AntdInput.Password
              autoComplete="password"
              size="large"
              className="has-text-dark"
              name="password"
              prefix={<AntdIcon type="lock" />}
              value={loginModel.password}
              onChange={inputsHandler}
              placeholder="Ο κωδικός σας"
              onPressEnter={loginHandler}
            />
          </AntdForm.Item>
          <AntdForm.Item>
            <AntdButton
              type="primary"
              size="large"
              onClick={loginHandler}
              block>
              {' '}
              Σύνδεση
            </AntdButton>
          </AntdForm.Item>
        </AntdForm>
      </AntdCol>
    </AntdRow>
  )
}

export default Login
