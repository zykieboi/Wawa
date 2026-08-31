import request from "../lib/request";
import { getFullUrl } from "../lib/request";

/** @param {{username: string, password: string}} params */
export const login = ({ username, password }) => {
  return request('POST', getFullUrl('auth', '/v2/login'), {
    ctype: 'Username',
    cvalue: username,
    password,
  }, undefined, undefined);
}

export const logout = () => {
  return request('POST', getFullUrl('auth', '/v2/logout'), {});
}

/** @param {{existingPassword: string, newPassword: string}} params */
export const changePassword = ({ existingPassword, newPassword }) => {
  return request('POST', getFullUrl('auth', `/v2/user/passwords/change`), {
    currentPassword: existingPassword,
    newPassword,
  });
}

/** @param {{username: string, context: string}} params */
export const validateUsername = ({ username, context }) => {
  return request('GET', getFullUrl('auth', `/v1/usernames/validate?username=${encodeURIComponent(username)}&context=${encodeURIComponent(context)}`)).then(d => d.data)
}

/** @param {{username: string, password: string}} params */
export const changeUsername = ({ username, password }) => {
  return request('POST', getFullUrl('auth', `/v1/username`), {
    username,
    password,
  })
}

export const logoutFromAllOtherSessions = () => {
  return request('POST', getFullUrl('auth', '/v2/logoutfromallsessionsandreauthenticate'))
}