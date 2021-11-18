class UrlConstants {
  // static BASE_URL = environment.apiUrl;
  // static API_URL = 'http://localhost:3001/api/'
  // static PROTECTED_URL = 'http://localhost:3001/protected/'
  static API = '/api/';
  static PROTECTED = '/protected/';

  // exports
  static SET_USER_SCHEDULES = 'schedule/week';
  static ALL_USER_SCHEDULES = 'schedule/week/all/<schedule_id>';
  static GET_TURNS = 'schedule/turn/<user_id>';
  static SET_TURN = 'schedule/turn/all';
}

export class ServerRoutes {
  static setUserSchedule() {
    return UrlConstants.PROTECTED + UrlConstants.SET_USER_SCHEDULES;
  }
  static getUserSchedule(schedule_id) {
    return UrlConstants.PROTECTED + UrlConstants.ALL_USER_SCHEDULES.replace('<schedule_id>', schedule_id);
  }
  static getUserTurns(user_id) {
    console.log('\n\nuser_id', user_id)

    return UrlConstants.PROTECTED + UrlConstants.GET_TURNS.replace('<user_id>', user_id);
  }
  static setTurn() {
    return UrlConstants.PROTECTED + UrlConstants.SET_TURN
  }
}