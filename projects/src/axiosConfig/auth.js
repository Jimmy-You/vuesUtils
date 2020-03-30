const TokenKey = 'PIECloud-Token'

// export function getToken() {// 线上开发
//   let cookieArr = document.cookie.split(";");
//   let obj = {token2:'',} 
//   cookieArr.forEach((i) => {
//   let arr = i.split("=");
//   obj[arr[0].trim()] =arr[1];
//   });
//   // console.log('cookieobj',obj)
//   // console.log('ciikiearr',cookieArr)
//   return obj.tokenDataMan
//   }

//   export function setToken() {//线上开发
//   let cookieArr = document.cookie.split(";");

//   let obj = {token2:'',} 
//   cookieArr.forEach((i) => {
//   let arr = i.split("=");
//   obj[arr[0].trim()] =arr[1];
//   });
//   // console.log('cookieobj',obj)
//   // console.log('ciikiearr',cookieArr)
//   return obj.tokenDataMan
//   }
export function getToken() {
  return window.localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return window.localStorage.setItem(TokenKey, token)
}
// 本地开发

export function removeToken() {
  return window.localStorage.removeItem(TokenKey)
}


//获取用户
const UserName = "user";
export function getUser() {
  return window.localStorage.getItem(UserName)
}

export function setUser(user) {
  return window.localStorage.setItem(UserName, user)
}

export function removeUser() {
  return window.localStorage.removeItem(UserName)
}

//获取用户id
const UserID = "userid";
export function getUserid() {
  return window.localStorage.getItem(UserID)
}

export function setUserid(userid) {
  return window.localStorage.setItem(UserID, userid)
}

export function removeUserid() {
  return window.localStorage.removeItem(UserID)
}

// 获取用户ID
const UserIDN = "userId";
export function getUserId() {
  return window.localStorage.getItem(UserIDN)
}

export function setUserId(userid) {
  return window.localStorage.setItem(UserIDN, userid)
}

export function removeUserId() {
  return window.localStorage.removeItem(UserIDN)
}


