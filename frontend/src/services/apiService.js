const { default: axios } = require("axios");
const { setCookie, getCookie } = require("cookies-next");

const baseURL = 'http://localhost:3000/api';

const encodeString = async (string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(string)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))

  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('')
}

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
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

export const getInstitutions = async () => {
  try {
    const resp = await axios.get(`${baseURL}/institutions`, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      }
    })

    if (resp.status === 200) {
      return resp.data;
    }
  } catch (e) {
    console.error(`Erro ao obter instituições: ${e}`);
  }
}

export const createInstitution = async (name) => {
  try {
    const resp = await axios.post(
      `${baseURL}/institutions`,
      { name },
      {
        headers: { Authorization: `Bearer ${getCookie("token")}` },
      }
    );

    if (resp.status === 201) {
      return resp.data;
    } else {
      throw new Error("Erro inesperado ao criar instituição");
    }
  } catch (e) {
    console.error("Erro ao criar instituição:", e);
  }
};



export const updateInstitution = async (id, name) => {
  try {
    const resp = await axios.put(
      `${baseURL}/institutions/${id}`,
      {
        name: name,
      },
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        }
      }
    )

    if (resp.status === 200) {
      return resp.data;
    } else {
      throw new Error("Erro inesperado ao atualizar instituição");
    }
  } catch (e) {
    console.error(`Erro ao criar instituição: ${e}`);
  }
}