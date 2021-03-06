import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserProfile} from '../shared/types/UserProfile';
import {UserStore} from '../core/users/user.store';
import {Subject, Subscription} from 'rxjs';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {UserService} from '../core/users/user.service';
import {CrossFieldErrorMatcher, LiveErrorStateMatcher} from '../shared/CustomerErrorStateMatchers';
import {takeUntil} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {LogService} from '../core/util/log.service';

function passwordMatchValidator(g: AbstractControl): null | ValidationErrors {
  const password1 = g.get('passwordFormControl');
  const password2 = g.get('passwordConfirmFormControl');
  return (password1 && password2 && password1.value === password2.value)
    ? null : {mismatch: true};
}

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit, OnDestroy {
  user: UserProfile;
  userSubscription: Subscription;
  detail: string;
  destroy$: Subject<boolean> = new Subject<boolean>();
  forgotPasswordForm = new FormGroup({
    emailFormControl: new FormControl('', [
      Validators.required, Validators.email
    ]),
  });

  passwordResetForm = new FormGroup({
    passwordForm: new FormGroup({
      passwordFormControl: new FormControl('', [
        Validators.minLength(8), Validators.required
      ]),
      passwordConfirmFormControl: new FormControl('')
    }, passwordMatchValidator),

  });

  userProfileForm = new FormGroup({
    email: new FormControl('', Validators.required),
  });

  matcher = new LiveErrorStateMatcher();
  crossFieldMatcher = new CrossFieldErrorMatcher();

  constructor(private userStore: UserStore, private userService: UserService, private http: HttpClient,
              private logService: LogService) {

  }

  public onPasswordResetFormSubmit(formData: {
    passwordForm: {
      passwordFormControl: string;
      passwordConfirmFormControl: string;
    };
  }): void {
    const body = {
      new_password1: formData.passwordForm.passwordFormControl,
      new_password2: formData.passwordForm.passwordConfirmFormControl
    };
    this.userService.changePassword(body).subscribe((resp: { detail: string } | HttpErrorResponse) => {
      if (!(resp instanceof HttpErrorResponse)) {
        this.detail = resp.detail;
        this.logService.snackBarMessage('Password successfully changed', 2000);
      } else if (resp instanceof HttpErrorResponse) {
        if (resp.error && resp.error.new_password2) {
          this.logService.snackBarMessage('Failed to change password: ' + resp.error.new_password2[0], 5000);
        } else {
          this.logService.snackBarError(resp, 2000);
        }
      }
    });
  }

  public onForgotPasswordFormSubmit(formData: { emailFormControl: string; }): void {
    this.userService.resetPassword(formData.emailFormControl).subscribe(resp => {
      if (resp && !(resp instanceof HttpErrorResponse)) {
        this.detail = resp.detail;
      } else if (resp instanceof HttpErrorResponse) {
        this.logService.snackBarError(resp, 4000);
      }
    });
  }

  ngOnInit(): void {
    this.userStore.getCurrentUser().pipe(takeUntil(this.destroy$)).subscribe(resp => {
      if (resp) {
        this.user = resp;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
