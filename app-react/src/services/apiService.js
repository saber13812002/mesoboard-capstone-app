class UrlConstants {
  // static BASE_URL = environment.apiUrl;
  // static API_URL = 'http://localhost:3001/api/'
  // static PROTECTED_URL = 'http://localhost:3001/protected/'
  static API = '/api/';
  static PROTECTED = '/protected/';

  // exports
  static VERIFY_PERMISSION = 'permission/verify';
  static SIGNUP = 'auth/signup';
  static LOGIN = 'auth/login';
  static LOGOUT = 'auth/logout';
  static VERIFY_TOKEN_GET_USER = 'auth/verifyToken/getUser';
  static SEND_RESET_PASSWORD = 'mailer/resetPassword';
  static ADD_PERMISSION = 'permission/add';
  // static ALL_PERMISSIONS = 'permission/all';
  // static ALL_PERMISSIONS_AND_INFO_URL = 'permission/allWithInfo';
  static ALL_PERMISSIONS_AND_USERS = 'permission/users/all';
  static USER_DATA = 'auth/userData';
  static ALL_RESTAURANTS = 'auth/restaurant/all'
  static SET_USER_SCHEDULES = 'schedule/week';
  static ALL_USER_SCHEDULES = 'schedule/week/all/<schedule_id>';
  static GET_TURNS = 'schedule/turn/all';
  static SET_TURN = 'schedule/turn';
  static REMOVE_TURN = 'schedule/turn/<turn_id>/remove';
  // static ALL_EMPLOYEES = 'employee/all';
  static USERS_WITH_SCHEDULE = 'profiles/schedule/all/<schedule_id>'
  static USER_WITH_SCHEDULE = 'profiles/schedule/<user_id>/<schedule_id>'
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
  static sendResetPassword() {
    return UrlConstants.API + UrlConstants.SEND_RESET_PASSWORD;
  }
  static getUserData() {
    return UrlConstants.PROTECTED + UrlConstants.USER_DATA;
  }
  static getAllRestaurants() {
    return UrlConstants.PROTECTED + UrlConstants.ALL_RESTAURANTS;
  }


  // PERMISSIONS
  static getAllUsersAndPermissions() {
    return UrlConstants.PROTECTED + UrlConstants.ALL_PERMISSIONS_AND_USERS;
  }
  static addPermission() {
    return UrlConstants.PROTECTED + UrlConstants.ADD_PERMISSION;
  }

  // SCHEDULE
  static setUserSchedule() {
    return UrlConstants.PROTECTED + UrlConstants.SET_USER_SCHEDULES;
  }
  static getUserSchedule(schedule_id) {
    return UrlConstants.PROTECTED + UrlConstants.ALL_USER_SCHEDULES.replace('<schedule_id>', schedule_id);
  }
  static getUserTurns() {
    return UrlConstants.PROTECTED + UrlConstants.GET_TURNS;
  }
  static setTurn() {
    return UrlConstants.PROTECTED + UrlConstants.SET_TURN;
  }
  static removeTurn(turn_id) {
    return UrlConstants.PROTECTED + UrlConstants.REMOVE_TURN
      .replace('<turn_id>', turn_id);
  }

  // PROFILES
  static getAllEmployees() {
    return UrlConstants.PROTECTED + UrlConstants.ALL_EMPLOYEES;
  }
  static getUsersWithSchedule(schedule_id) {
    return UrlConstants.PROTECTED + UrlConstants.USERS_WITH_SCHEDULE.replace('<schedule_id>', schedule_id)
  }
  static getUserWithSchedule(user_id, schedule_id) {
    return UrlConstants.PROTECTED + UrlConstants.USER_WITH_SCHEDULE
      .replace('<user_id>', user_id)
      .replace('<schedule_id>', schedule_id);
  }
}