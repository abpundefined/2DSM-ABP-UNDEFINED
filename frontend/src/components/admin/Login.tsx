import { useState, type FormEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import type { AuthUser } from "../../services/authService";

type LoginProps = {
  onLoginSuccess: (user: AuthUser) => void;
};

export function Login({ onLoginSuccess }: LoginProps) {
  const { login, recoverPassword, resetPassword, error, loading } = useAuth();
  
  // Estados dos campos
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  // Estados de UI/UX
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [recoveryMessage, setRecoveryMessage] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setRecoveryMessage("");

    if (isCodeSent) {
      // Fluxo 3: Enviar código e nova senha
      if (resetPassword) {
        try {
          await resetPassword(email, code, newPassword);
          setRecoveryMessage("Senha redefinida com sucesso! Você já pode fazer o login.");
          setIsCodeSent(false);
          setIsForgotPassword(false);
          setCode("");
          setNewPassword("");
          setPassword("");
        } catch (e) {
          // O erro já é tratado no useAuth
        }
      }
      return;
    }

    if (isForgotPassword) {
      // Fluxo 2: Solicitar código
      if (recoverPassword) {
        try {
          await recoverPassword(email);
          setRecoveryMessage("Código de verificação enviado! Verifique seu e-mail.");
          setIsCodeSent(true);
        } catch (e) {
          // O erro já é tratado no useAuth
        }
      }
      return;
    }

    // Fluxo 1: Login
    const authenticatedUser = await login(email, password);

    if (authenticatedUser) {
      onLoginSuccess(authenticatedUser);
    }
  };

  const cancelRecovery = () => {
    setIsForgotPassword(false);
    setIsCodeSent(false);
    setRecoveryMessage("");
    setCode("");
    setNewPassword("");
  };

  return (
    <div className="sd-login-box">
      <h2>Área Administrativa</h2>
      <p>{isForgotPassword ? "Recuperação de senha" : "Acesso restrito para secretaria e administradores."}</p>

      <form onSubmit={handleSubmit} className="sd-login-form">
        
        {/* Campo de E-mail: Só aparece no Login ou no 1º passo do Esqueci a senha */}
        {!isCodeSent && (
          <div className="sd-input-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="admin@fatec.sp.gov.br"
            />
          </div>
        )}

        {/* Campos do Login Padrão */}
        {!isForgotPassword && (
          <div className="sd-input-group">
            <div className="sd-password-header">
              <label htmlFor="password">Senha</label>
              <button 
                type="button" 
                className="sd-forgot-password-link" 
                onClick={() => setIsForgotPassword(true)}
              >
                Esqueceu sua senha?
              </button>
            </div>
            <div className="sd-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="sd-password-input"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                placeholder="Digite sua senha"
              />
              <button 
                type="button" 
                className="sd-toggle-password" 
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12c-2.48 0-4.5-2.02-4.5-4.5S9.52 7.5 12 7.5 16.5 9.52 16.5 12 14.48 16.5 12 16.5zm0-7.5c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.83 9L15 12.16V12a3 3 0 00-3-3h-.17zm-4.3.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.48 0-4.5-2.02-4.5-4.5 0-.79.2-1.53.53-2.2zm15.36 2.2c-1.54 3.95-5.46 6.8-10.39 6.8-1.74 0-3.36-.38-4.83-1.04L2.81 20 1.4 18.59l18.38-18.38L21.19 1.6 18.5 4.3C20.3 5.6 21.8 7.3 22.89 12zM12 4.5c1.48 0 2.87.31 4.13.86l-1.84 1.84c-.72-.13-1.48-.2-2.29-.2-4.93 0-8.85 2.85-10.39 6.8 1.13 2.9 3.48 5.25 6.36 6.36l-1.84 1.84A10.99 10.99 0 011 12c1.73-4.39 6-7.5 11-7.5z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Campos do 2º passo do Esqueci a senha */}
        {isCodeSent && (
          <>
            <div className="sd-input-group">
              <label htmlFor="code">Código de Verificação (6 dígitos)</label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                required
                maxLength={6}
                placeholder="Ex: 123456"
              />
            </div>
            <div className="sd-input-group">
              <label htmlFor="newPassword">Nova Senha</label>
              <div className="sd-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  className="sd-password-input"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  required
                  placeholder="Digite sua nova senha"
                />
                <button 
                  type="button" 
                  className="sd-toggle-password" 
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12c-2.48 0-4.5-2.02-4.5-4.5S9.52 7.5 12 7.5 16.5 9.52 16.5 12 14.48 16.5 12 16.5zm0-7.5c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.83 9L15 12.16V12a3 3 0 00-3-3h-.17zm-4.3.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.48 0-4.5-2.02-4.5-4.5 0-.79.2-1.53.53-2.2zm15.36 2.2c-1.54 3.95-5.46 6.8-10.39 6.8-1.74 0-3.36-.38-4.83-1.04L2.81 20 1.4 18.59l18.38-18.38L21.19 1.6 18.5 4.3C20.3 5.6 21.8 7.3 22.89 12zM12 4.5c1.48 0 2.87.31 4.13.86l-1.84 1.84c-.72-.13-1.48-.2-2.29-.2-4.93 0-8.85 2.85-10.39 6.8 1.13 2.9 3.48 5.25 6.36 6.36l-1.84 1.84A10.99 10.99 0 011 12c1.73-4.39 6-7.5 11-7.5z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {error && <div className="sd-auth-error">{error}</div>}
        {recoveryMessage && <div className="sd-auth-success">{recoveryMessage}</div>}

        <button type="submit" disabled={loading} className="sd-btn-primary">
          {loading 
            ? (isCodeSent ? "Redefinindo..." : (isForgotPassword ? "Enviando..." : "Autenticando...")) 
            : (isCodeSent ? "Redefinir Senha" : (isForgotPassword ? "Enviar Instruções" : "Entrar"))}
        </button>

        {isForgotPassword && (
          <button 
            type="button" 
            className="sd-back-link" 
            onClick={cancelRecovery}
          >
            Voltar ao Login
          </button>
        )}
      </form>
    </div>
  );
}
