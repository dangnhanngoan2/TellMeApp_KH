import { api } from "./api";

export const apiAuth = {
  login: (phone, pin_code, token_firebase) =>
    api.post("auth/login", {
      phone,
      pin_code,
      type_id: 3,
      token_firebase,
      version: "3.0",
    }),

  loginWithFacebook: (facebookToken, facebookId) =>
    api.post("auth/login-facebook", { facebookToken, facebookId }),

  loginWithZalo: (authCode, userId, phone, email) =>
    api.post("auth/login-zalo", { authCode, userId, phone, email }),

  signup: (params) => api.postFormData("auth/signup", params),

  signupShort: (params) => api.post("auth/signup", params),

  checkPinCode: (pin_code, user_id) => {
    return api.post("auth/check-pin-code", { token, password, email });
  },

  logout: () => api.get("logout"),

  // token

  createToken: (token, password, email) => {
    return api.post("password/create", { token, password, email });
  },

  // password

  createPassword: (token, password, type_id) => {
    return api.post("auth/create-password", { token, password, type_id });
  },

  resetPassword: (token, password, email) => {
    return api.post("password/reset", { token, password, email });
  },

  //register
  checkPhoneNumber: (phone) => {
    return api.post("auth/check-phone-number", { phone, type_id: 3 });
  },

  updatePinCode: (pin_code, user_id) => {
    return api.post("auth/update-pin-code", { pin_code, user_id });
  },

  addMoney: () => {
    return api.post("add-money", { user_id: "52", amount: "1000000000" });
  },
  gethistorybook: () => {
    return api.post("books-by-wallet?page=1", { status: 0 });
  },
  updateprofile: (params) => {
    return api.post("update-user", params);
  },

  sendSms: (phone) => {
    return api.post("auth/esms-code", { phone });
  },
  checkPincode: (phone, verify_code) => {
    return api.post("auth/check-esms-code", { phone, verify_code });
  },
  ///auth/active-user
  activeUser: (phone, verify_code) => {
    return api.post("auth/active-user", { phone, verify_code });
  },

  // get ENV config
  getENV: () => {
    return api.get(`auth/get-env`);
  },
};
