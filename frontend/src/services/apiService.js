const { default: axios } = require("axios");
const { setCookie } = require("cookies-next");

const baseURL = 'http://localhost:3000/api';

const encodeString = async(string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(string)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('')
}

export const auth = async (userName, password) => {
  try {
    const encodedPassword = await encodeString(password)

    const resp = await axios.post(`${baseURL}/auth/login`, {
      userName: userName,
      password: encodedPassword
    })

    if (resp.status === 200) {
      const token = resp.data.token;

      setCookie("token", token, { maxAge: 60 * 60 * 24, path: "/", secure: true, httpOnly: false });
    }
  } catch (e) {
    console.error(`Erro ao realizar login: ${e}`);
  }
}