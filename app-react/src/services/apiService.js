class UrlConstants {
  // static BASE_URL = environment.apiUrl;
  // static API_URL = 'http://localhost:3001/api/'
  // static PROTECTED_URL = 'http://localhost:3001/protected/'
  static API = '/api/'
  static PROTECTED = '/protected/'

  // exports
  static ALL_USER_SCHEDULES = 'schedule/week/all/<schedule_id>';
}

export class ServerRoutes {
  static getUserSchedule(schedule_id) {
    return UrlConstants.PROTECTED + UrlConstants.ALL_USER_SCHEDULES.replace('<schedule_id>', schedule_id)
  }
}