import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromUserAssignments from '../user-panel/user-assignments/store/user-assignments.reducer';
import * as fromUserChangePassword from '../user-panel/change-password/store/user-change-password.reducer';
import * as fromAdminManageUsers from '../admin-panel/manage-users/store/admin-manage-users.reducer';
import * as fromAdminManageSpecialties from '../admin-panel/manage-specialties/store/admin-manage-specialties.reducer';
import * as fromAdminManageStateAndSemesters from '../admin-panel/manage-state-and-semesters/store/admin-manage-state-and-semesters.reducer';
import * as fromAdminManageAssignments from '../admin-panel/manage-assignments/store/admin-manage-assignments.reducer';
import * as fromAdminManageSubjects from '../admin-panel/manage-subjects/store/admin-manage-subjects.reducer';
import * as fromAdminManageHomePage from '../admin-panel/manage-home-page/store/admin-manage-home-page.reducer';

export interface AppState {
  auth: fromAuth.State;
  userChangePassword: fromUserChangePassword.State;
  userAssignments: fromUserAssignments.State;
  adminManageUsers: fromAdminManageUsers.State;
  adminManageSpecialties: fromAdminManageSpecialties.State;
  adminManageStateAndSemesters: fromAdminManageStateAndSemesters.State;
  adminManageAssignments: fromAdminManageAssignments.State;
  adminManageSubjects: fromAdminManageSubjects.State;
  adminManageHomePage: fromAdminManageHomePage.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  auth: fromAuth.authReducer,
  userChangePassword: fromUserChangePassword.userChangePasswordReducer,
  userAssignments: fromUserAssignments.userAssignmentsReducer,
  adminManageUsers: fromAdminManageUsers.adminManageUserReducer,
  adminManageSpecialties: fromAdminManageSpecialties.adminManageSpecialtiesReducer,
  adminManageStateAndSemesters: fromAdminManageStateAndSemesters.adminManageStateAndSemestersReducer,
  adminManageAssignments: fromAdminManageAssignments.adminManageAssignmentsReducer,
  adminManageSubjects: fromAdminManageSubjects.adminManageSubjectsReducer,
  adminManageHomePage: fromAdminManageHomePage.adminManageHomePageReducer
};
