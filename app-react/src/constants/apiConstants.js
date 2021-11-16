// import { environment } from '@environments/environment';
// class UrlConstants {
//   static BASE_URL = environment.apiUrl;

//   // exports
//   static EXPORT_PROJECTS = 'download/projects-list/session/<session_id>';

//   // authentication
//   static LOGIN_URL = 'auth/login';
//   static CHECK_PERMISSIONS_URL = 'permissions/verify';
//   static SIGN_UP_URL = 'auth/signup';
//   static USER_INFO_URL = 'auth/userInfo';
//   static SIGN_OUT_SINGLE = 'auth/logout/single';
//   static USER_OVERVIEW_URL = 'auth/overview';
//   static REQUEST_PASSWORD_RESET = 'mailer/resetPassword';

//   // events
//   static EVENTS_ALL_URL = 'events/all';
//   static EVENTS_IN_SESSION_URL = 'events/session/';
//   static EVENT_ADD_URL = 'events/new';
//   static SCHEDULE_IN_EVENT = 'schedule/';

//   // notifications
//   static NOTIFICATIONS_UNSEEN = 'notifications/unseen';
//   static NOTIFICATIONS_MARK_SEEN_ALL = 'notifications/markAllAsSeen';
//   static SEND_NOTIFICATION = 'notifications/new';
//   static NOTIFICATIONS_ALL = 'notifications/all';
//   static NOTIFICATIONS_SEND_SHOUT = 'mailer/shout';

//   // projects
//   static PROJECTS_IN_SESSION = 'projects/session/<session_id>';
//   static PROJECT_ID = 'projects/id/<project_id>';
//   static PROJECT_ADVISORS_URL = 'projects/<project_id>/professors';
//   static PROJECT_STUDENTS_URL = 'projects/<project_id>/students';
//   static PROJECT_ADD_MEMBER_URL = 'projects/<project_id>/addMember';
//   static PROJECT_ADD_KEYWORD_URL = 'projects/<project_id>/addKeyword';
//   static PROJECT_REMOVE_KEYWORD_URL =
//     'projects/<project_id>/removeKeyword/<keyword>';
//   static PROJECT_REMOVE_MEMBER_URL = 'projects/<project_id>/remove/<user_id>';
//   static PROFESSOR_PROJECTS = 'projects/user/<user_id>/session/<session_id>';
//   static PROJECT_UPLOAD_POSTER = 'storage/upload/project/<project_id>/poster';
//   static PROJECT_UPLOAD_PRESENTATION =
//     'storage/upload/project/<project_id>/presentation';
//   static PROJECT_SEARCH_NOT_MEMBERS =
//     'projects/<project_id>/notMembers/search?name=<user_name>';
//   static PROJECT_SEARCH_MEMBERS =
//     'projects/<project_id>/Members/search?name=<user_name>';
//   static SPONSOR_PROJECTS_URL =
//     'projects/session/<session_id>/sponsor/<sponsor_id>';
//   static POSTERS_EVALUATE = 'evaluate/posters/<session_id>';
//   static CURRENT_PRESENTATIONS = 'projects/currently_presenting';
//   static PROJECTS_REPORT = 'projects/report/<session_id>';

//   // proposals
//   static PROPOSALS_ALL_URL = 'proposals/all';
//   static PROPOSALS_SESSION_URL = 'proposals/session/';
//   static PROPOSALS_SUBMIT_URL = 'proposals/addProposal';
//   static PROPOSALS_APPROVE_URL = 'proposals/<proposal_id>/approve';
//   static PROPOSALS_REJECT_URL = 'proposals/<proposal_id>/reject';
//   static PROPOSALS_PROFESSORS = 'proposals/user/<user_id>/session/<session_id>';
//   static PROPOSALS_FILE_UPLOAD =
//     'storage/upload/proposal/<proposal_id>/proposal';
//   static PROPOSALS_SPONSOR =
//     'proposals/sponsor/<sponsor_id>/session/<session_id>';
//   static PROPOSALS_SUBMIT_SPONSOR_URL = 'proposals/sponsorSubmitProposal';
//   static PROPOSALS_UPDATE_URL = 'proposals/<proposal_id>/update';
//   static PROPOSAL_FUNDING_PROJECT_BALANCE_UPDATE_URL = 'proposals/<proposal_id>/updateProposalFundingAndProjectBalance';

//   // sessions
//   static SESSIONS_ALL_URL = 'sessions/all';
//   static SESSIONS_ADD_URL = 'sessions/new';
//   static SPONSORS_IN_SESSION_URL = 'sessions/<session_id>/sponsors';
//   static SESSIONS_ADD_SPONSOR_URL = 'sessions/<session_id>/addSponsor';
//   static SPONSORS_NOT_IN_SESSION = 'sessions/<session_id>/inactiveSponsors';
//   static SESSION_COMMITTEE = 'sessions/<session_id>/committee';
//   static SESSION_PROF_NOT_COMMITTEE = 'sessions/<session_id>/notCommittee';
//   static SESSION_ADD_COMMITTEE = 'sessions/<session_id>/committee/new';
//   static SESSION_REMOVE_COMMITTEE = 'sessions/<session_id>/committee/remove';

//   static SESSION_EDIT_DONATION =
//     'sessions/<session_id>/edit-sponsor/<sponsor_id>';
//   static SESSION_EDIT_INITIAL_FUNDS = 'sessions/<session_id>/edit-funds';

//   // sponsors
//   static SPONSORS_ALL_URL = 'sponsors/all';
//   static SPONSORS_BY_ID_URL = 'sponsors/';
//   static SPONSORS_ADD = 'sponsors/new';
//   static EDIT_SPONSOR = 'sponsors/edit/<sponsor_id>';

//   static SESSIONS_REMOVE_SPONSOR_URL = 'sponsors/remove/<session_id>';
//   static SESSIONS_DELETE_SPONSOR_URL = 'sponsors/delete/<sponsor_id>';
//   static SESSIONS_SPONSORS_ACTIVE = 'sponsors/active';
//   static SPONSORS_UPLOAD_LOGO = 'storage/upload/sponsor/<sponsor_id>/logo';
//   static SPONSORS_COMPANY_REPRESENTATIVES = 'sponsors/<sponsor_id>/members';

//   // users
//   static ALL_PROFESSORS_URL = 'professors/all';
//   static ALL_STUDENTS_URL = 'students/all';
//   static STUDENT_BY_ID = 'students/<student_id>'
//   static ALL_USERS_AND_PERMISSION_USERS_URL = 'permissions/users/all';
//   static PROFESSORS_BY_ID_URL = 'professors/';
//   static ALL_PERMISSIONS_URL = 'permissions/all';
//   static ALL_PERMISSIONS_AND_INFO_URL = 'permissions/allWithInfo';
//   static ADD_PERMISSIONS_URL = 'permissions/add';
//   static REMOVE_PERMISSIONS_URLL = 'permissions/revoke';
//   static CHANGE_PROFESSOR_PROFILE_PICTURE =
//     'storage/upload/user/<user_id>/profile-picture';
//   static UPDATE_PROFESSOR_PROFILE = 'professors/<user_id>/updateInfo';
//   static UPDATE_STUDENT_PROFILE = 'students/<user_id>/updateInfo';
//   static STUDENTS_TABLE = 'students/table';
//   static ACTIVE_STUDENTS_TABLE = 'students/activeTable';
//   static SESSION_STUDENTS_TABLE = 'students/session/<session_id>/table';
//   static STUDENT_PROJECTS = 'students/<user_id>/projects/session/<session_id>';
//   static UPLOAD_RESUME = 'storage/upload/student/<user_id>/resume';
//   static DOWNLOAD_RESUME = 'students/<user_id>/resume';
//   static STUDENT_RESUME_ID_BY_USER_ID = 'students/user_id/<user_id>/resume';
//   static DOWNLOAD_RESUME_BOOK = 'storage/download/resume/all';
//   static EXPORT_STUDENTS = 'download/assistance-list/session/<session_id>';

//   // purchases
//   static ALL_PURCHASE_ACCOUNTS = 'accounts/all';
//   static ACCOUNTS_REPORT = 'accounts/report/<session_id>';
//   static ACCOUNT_ITEMS_REPORT = 'accounts/<account_id>/report/<session_id>';
//   static UPDATE_PURCHASE_ACCOUNT = 'accounts/<account_id>/update';
//   static CREATE_ACCOUNT = 'accounts/new';
//   static DELETE_ACCOUNT = 'accounts/delete';
//   static ALL_PURCHASES = 'purchases/all';
//   static SESSION_PURCHASES = 'purchases/session/<session_id>';
//   static ADD_PURCHASE = 'projects/<project_id>/purchases/add';
//   static PURCHASE_FILE_UPLOAD = 'storage/upload/purchase/<purchase_id>/receipt';
//   static PURCHASE_ITEMS = 'purchases/<purchase_id>/items';
//   static APPROVE_PURCHASE = 'purchases/<purchase_id>/approve';
//   static REJECT_PURCHASE = 'purchases/<purchase_id>/reject';
//   static PURCHASE_LIQUIDATION = 'purchases/liquidation/<user_id>';
//   static ADMIN_LIQUIDATIONS = 'purchases/<session_id>/liquidations'
//   static VISA_LIQUIDATION = 'purchases/visa_liquidation/<user_id>';
//   static PURCHASES_BREAKDOWN = 'purchases/<session_id>/breakdown/<author_id>/<type>/<date>';
//   static MARK_ALL_AS_PRINTED = 'purchases/mark_all_as_printed/<user_id>';
//   static GENERAL_PURCHASES_REPORT = 'purchases/reports/general/<session_id>';
//   static TRANSFER_MONEY = 'accounts/transfers';
//   static PURCHASES_BULK = 'download/purchase-docs-bulk';
//   static FELLOWSHIP = 'purchases/fellowship';

//   // VOTING
//   static GET_EVALUATION_STATUS = 'evaluations/representative/status';
//   static SUBMIT_PROJECT_EVALUATION = 'evaluations/submit';
//   static VOTE_STATUS = 'votes/status';
//   static SUBMIT_VOTE = 'votes/submit';
// }

class UrlConstants {
  // static BASE_URL = environment.apiUrl;
  static API_URL = 'http://localhost:3001/api/'
  static PROTECTED_URL = 'http://localhost:3001/protected/'

  // exports
  static ALL_USER_SCHEDULES = 'protected/schedule/week/all/<schedule_id>';
}

export class ServerRoutes {

  static getUserSchedule(schedule_id) {
    return UrlConstants.PROTECTED_URL + UrlConstants.ALL_USER_SCHEDULES.replace('<schedule_id>', schedule_id)
  }

  // // purchases
  // static purchaseAcounts(): string {
  //   return UrlConstants.BASE_URL + UrlConstants.ALL_PURCHASE_ACCOUNTS;
  // }

  // static accountsReport(session_id): string {
  //   return UrlConstants.BASE_URL + UrlConstants.ACCOUNTS_REPORT.replace('<session_id>', session_id);
  // }

  // static accountItemsReport(account_id, session_id): string {
  //   return UrlConstants.BASE_URL
  //     + UrlConstants.ACCOUNT_ITEMS_REPORT
  //       .replace('<account_id>', account_id)
  //       .replace('<session_id>', session_id);
  // }

  // static makeTransfer(): string {
  //   return UrlConstants.BASE_URL + UrlConstants.TRANSFER_MONEY;
  // }

  // static purchases(): string {
  //   return UrlConstants.BASE_URL + UrlConstants.ALL_PURCHASES;
  // }

  // static sessionPurchases(session_id): string {
  //   return UrlConstants.BASE_URL + UrlConstants.SESSION_PURCHASES.replace('<session_id>', session_id);
  // }

  // static addPurchase(project_id): string {
  //   return (
  //     UrlConstants.BASE_URL +
  //     UrlConstants.ADD_PURCHASE.replace('<project_id>', project_id)
  //   );
  // }

  // static Fellowship(): string {
  //   return UrlConstants.BASE_URL + UrlConstants.FELLOWSHIP;
  // }

  // static handlePurchase(purchase_id: number, approved: boolean): string {
  //   if (approved) {
  //     return (
  //       UrlConstants.BASE_URL +
  //       UrlConstants.APPROVE_PURCHASE.replace(
  //         '<purchase_id>',
  //         String(purchase_id)
  //       )
  //     );
  //   } else {
  //     return (
  //       UrlConstants.BASE_URL +
  //       UrlConstants.REJECT_PURCHASE.replace(
  //         '<purchase_id>',
  //         String(purchase_id)
  //       )
  //     );
  //   }
  // }


  // static editSponsor(sponsor_id): string {
  //   return UrlConstants.BASE_URL + UrlConstants.EDIT_SPONSOR.replace('<sponsor_id>', sponsor_id);
  // }

  // static changeProfessorPicture(professor_id: number): string {
  //   return (
  //     UrlConstants.BASE_URL +
  //     UrlConstants.CHANGE_PROFESSOR_PROFILE_PICTURE.replace(
  //       '<user_id>',
  //       professor_id.toString()
  //     )
  //   );
  // }
  // static changeResume(student_id: number): string {
  //   return (
  //     UrlConstants.BASE_URL +
  //     UrlConstants.UPLOAD_RESUME.replace('<user_id>', student_id.toString())
  //   );
  // }

  // // Notifications
  // static allNotifications(): string {
  //   return UrlConstants.BASE_URL + UrlConstants.NOTIFICATIONS_ALL;
  // }
  // static markSeenAllNotifications(): string {
  //   return UrlConstants.BASE_URL + UrlConstants.NOTIFICATIONS_MARK_SEEN_ALL;
  // }
  // static unseenNotifications(): string {
  //   return UrlConstants.BASE_URL + UrlConstants.NOTIFICATIONS_UNSEEN;
  // }
  // static sendNotification(): string {
  //   return UrlConstants.BASE_URL + UrlConstants.SEND_NOTIFICATION;
  // }
  // static sendShout(): string {
  //   return UrlConstants.BASE_URL + UrlConstants.NOTIFICATIONS_SEND_SHOUT;
  // }

  // // Projects
  // static projectsInSessionUrl(session_id: number): string {
  //   return (
  //     UrlConstants.BASE_URL +
  //     UrlConstants.PROJECTS_IN_SESSION.replace(
  //       '<session_id>',
  //       session_id.toString()
  //     )
  //   );
  // }

  // static projectsReport(session_id: number): string {
  //   return UrlConstants.BASE_URL + UrlConstants.PROJECTS_REPORT.replace('<session_id>', session_id.toString());
  // }

  // static projectByIdUrl(project_id: number): string {
  //   return UrlConstants.BASE_URL + UrlConstants.PROJECT_ID.replace(
  //     '<project_id>',
  //     project_id.toString()
  //   );
  // }

  // static projectAdvisorsUrl(project_id: number): string {
  //   return (
  //     UrlConstants.BASE_URL +
  //     UrlConstants.PROJECT_ADVISORS_URL.replace(
  //       '<project_id>',
  //       project_id.toString()
  //     )
  //   );
  // }
  // static projectMembersUrl(project_id: number): string {
  //   return (
  //     UrlConstants.BASE_URL +
  //     UrlConstants.PROJECT_STUDENTS_URL.replace(
  //       '<project_id>',
  //       project_id.toString()
  //     )
  //   );
  // }
  // static addProjectMemberUrl(project_id: number): string {
  //   return (
  //     UrlConstants.BASE_URL +
  //     UrlConstants.PROJECT_ADD_MEMBER_URL.replace(
  //       '<project_id>',
  //       project_id.toString()
  //     )
  //   );
  // }
  // static addProjectKeywordUrl(project_id: number): string {
  //   return (
  //     UrlConstants.BASE_URL +
  //     UrlConstants.PROJECT_ADD_KEYWORD_URL.replace(
  //       '<project_id>',
  //       project_id.toString()
  //     )
  //   );
  // }
  // static removeProjectKeywordUrl(project_id: number, keyword: string): string {
  //   const path = UrlConstants.PROJECT_REMOVE_KEYWORD_URL.replace(
  //     '<keyword>',
  //     encodeURIComponent(keyword)
  //   );
  //   return (
  //     UrlConstants.BASE_URL +
  //     path.replace('<project_id>', project_id.toString())
  //   );
  // }
  // static removeProjectMemberUrl(project_id: number, user_id: number): string {
  //   const path = UrlConstants.PROJECT_REMOVE_MEMBER_URL.replace(
  //     '<project_id>',
  //     project_id.toString()
  //   );
  //   return (
  //     UrlConstants.BASE_URL + path.replace('<user_id>', user_id.toString())
  //   );
  // }
  // static professorProjectUrl(session_id: number, user_id: number): string {
  //   const path = UrlConstants.PROFESSOR_PROJECTS.replace(
  //     '<session_id>',
  //     session_id.toString()
  //   );
  //   return (
  //     UrlConstants.BASE_URL + path.replace('<user_id>', user_id.toString())
  //   );
  // }
  // static uploadProjectPoster(project_id: number): string {
  //   return (
  //     UrlConstants.BASE_URL +
  //     UrlConstants.PROJECT_UPLOAD_POSTER.replace(
  //       '<project_id>',
  //       project_id.toString()
  //     )
  //   );
  // }
  // static uploadProjectPresentation(project_id: number): string {
  //   return (
  //     UrlConstants.BASE_URL +
  //     UrlConstants.PROJECT_UPLOAD_PRESENTATION.replace(
  //       '<project_id>',
  //       project_id.toString()
  //     )
  //   );
  // }
  // static searchPossibleUsersNotMembersOfProject(
  //   project_id: number,
  //   input_str: string
  // ): string {
  //   const path = UrlConstants.PROJECT_SEARCH_NOT_MEMBERS.replace(
  //     '<project_id>',
  //     project_id.toString()
  //   );
  //   return UrlConstants.BASE_URL + path.replace('<user_name>', input_str);
  // }
  // static searchPossibleUsersMembersOfProject(
  //   project_id: number,
  //   input_str: string
  // ): string {
  //   const path = UrlConstants.PROJECT_SEARCH_MEMBERS.replace(
  //     '<project_id>',
  //     project_id.toString()
  //   );
  //   return UrlConstants.BASE_URL + path.replace('<user_name>', input_str);
  // }
  // static sponsorProjectsInSession(
  //   session_id: number,
  //   sponsor_id: number
  // ): string {
  //   const path = UrlConstants.SPONSOR_PROJECTS_URL.replace(
  //     '<session_id>',
  //     session_id.toString()
  //   );
  //   return (
  //     UrlConstants.BASE_URL +
  //     path.replace('<sponsor_id>', sponsor_id.toString())
  //   );
  // }

}
