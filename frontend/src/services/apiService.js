const { default: axios } = require("axios");
const { setCookie } = require("cookies-next");

const baseURL = 'http://localhost:3000/api';

export const auth = async (userName, password) => {
  try {
    const resp = await axios.post(`${baseURL}/auth/login`, {
      userName: userName,
      password: password
    })

    if (resp.status === 200) {
      const token = resp.data.token;

      setCookie("token", token, { maxAge: 60 * 60 * 24, path: "/", secure: true, httpOnly: false });

      window.location.href = "/private/dashboard";
    }
  } catch (e) {
    console.error(`Erro ao realizar login: ${e}`);
  }
}