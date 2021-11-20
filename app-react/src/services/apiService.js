class UrlConstants {
  // static BASE_URL = environment.apiUrl;
  // static API_URL = 'http://localhost:3001/api/'
  // static PROTECTED_URL = 'http://localhost:3001/protected/'
  static API = '/api/';
  static PROTECTED = '/protected/';

  //
  // exports
  static VERIFY_PERMISSION = 'permissions/verify';
  static SIGNUP = 'auth/signup';
  static LOGIN = 'auth/login';
  static LOGOUT = 'auth/logout';
  static VERIFY_TOKEN_GET_USER = 'auth/verifyToken/getUser';
  static ADD_PERMISSION = 'permissions/add';
  static GET_USER_DATA = 'auth/userData';
  static SET_USER_SCHEDULES = 'schedule/week';
  static ALL_USER_SCHEDULES = 'schedule/week/all/<schedule_id>';
  static GET_TURNS = 'schedule/turn/<user_id>';
  static SET_TURN = 'schedule/turn/all';
}

export class ServerRoutes {
  static verifyPermission() {
    return UrlConstants.API + UrlConstants.VERIFY_PERMISSION;
  }
  static signup() {
    return UrlConstants.API + UrlConstants.SIGNUP;
  }
  static login() {
    return UrlConstants.API + UrlConstants.LOGIN;
  }
  static logout() {
    return UrlConstants.PROTECTED + UrlConstants.LOGOUT;
  }
  static verifyTokenAndGetUser() {
    return UrlConstants.API + UrlConstants.VERIFY_TOKEN_GET_USER;
  }
  static getUserData() {
    return UrlConstants.PROTECTED + UrlConstants.GET_USER_DATA
  }
  static addPermission() {
    return UrlConstants.PROTECTED + UrlConstants.ADD_PERMISSION;
  }
  static setUserSchedule() {
    return UrlConstants.PROTECTED + UrlConstants.SET_USER_SCHEDULES;
  }
  static getUserSchedule(schedule_id) {
    return UrlConstants.PROTECTED + UrlConstants.ALL_USER_SCHEDULES.replace('<schedule_id>', schedule_id);
  }
  static getUserTurns(user_id) {
    return UrlConstants.PROTECTED + UrlConstants.GET_TURNS.replace('<user_id>', user_id);
  }
  static setTurn() {
    return UrlConstants.PROTECTED + UrlConstants.SET_TURN
  }
}