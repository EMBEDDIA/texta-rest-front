import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatChipsModule} from '@angular/material/chips';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSliderModule} from '@angular/material/slider';
import {FlexLayoutModule} from '@angular/flex-layout';
import {LoginDialogComponent} from './components/dialogs/login/login-dialog.component';
import {GenericTableComponent} from './components/generic-table/generic-table.component';
import {RegistrationDialogComponent} from './components/dialogs/registration/registration-dialog.component';
import {ConfirmDialogComponent} from './components/dialogs/confirm-dialog/confirm-dialog.component';
import {MatOptionSelectAllComponent} from './components/mat-option-select-all.component';
import {QueryDialogComponent} from './components/dialogs/query-dialog/query-dialog.component';
import {GenericDialogComponent} from './components/dialogs/generic-dialog/generic-dialog.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {SavedSearchAutocompleteComponent} from './components/saved-search-autocomplete/saved-search-autocomplete.component';
import {LineChartModule} from '@swimlane/ngx-charts';
import {MatTreeModule} from '@angular/material/tree';
import {MaterialFileInputModule} from 'ngx-material-file-input';
import {FormatTextaFactsPipe} from './pipes/format-texta-facts.pipe';
import {IsObjectPipe} from './pipes/is-object.pipe';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {MatRadioModule} from '@angular/material/radio';
import { GroupSameValuesPipe } from './pipes/group-same-values.pipe';
import { GetPropertyListPipe } from './pipes/get-property-list.pipe';
import { JoinPipe } from './pipes/join.pipe';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import {RouterModule} from '@angular/router';
import { LimitTextComponent } from './components/limit-text/limit-text.component';

@NgModule({
  declarations: [LoginDialogComponent, GenericTableComponent,
    RegistrationDialogComponent,
    ConfirmDialogComponent,
    MatOptionSelectAllComponent,
    QueryDialogComponent,
    GenericDialogComponent,
    SavedSearchAutocompleteComponent,
    FormatTextaFactsPipe,
    IsObjectPipe,
    GroupSameValuesPipe,
    GetPropertyListPipe,
    JoinPipe,
    BreadcrumbComponent,
    LimitTextComponent
  ],
  imports: [
    RouterModule,

    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatTableModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatSliderModule,
    MatTreeModule,
    MatRadioModule,
    LineChartModule,
    InfiniteScrollModule,
    MaterialFileInputModule,
    NgxMatSelectSearchModule
  ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        FlexLayoutModule,
        ScrollingModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatInputModule,
        MatToolbarModule,
        MatSnackBarModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatIconModule,
        MatDialogModule,
        MatButtonModule,
        MatCardModule,
        MatSidenavModule,
        MatListModule,
        MatMenuModule,
        MatTableModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatSortModule,
        MatTabsModule,
        MatProgressBarModule,
        MatExpansionModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTooltipModule,
        MatSliderModule,
        MatTreeModule,
        MatRadioModule,
        GenericTableComponent,
        SavedSearchAutocompleteComponent,
        MatOptionSelectAllComponent,
        FormatTextaFactsPipe,
        IsObjectPipe,
        LineChartModule,
        GroupSameValuesPipe,
        InfiniteScrollModule,
        MaterialFileInputModule,
        NgxMatSelectSearchModule,
        GetPropertyListPipe,
        JoinPipe,
        BreadcrumbComponent,
        LimitTextComponent
    ]
})
export class SharedModule {
}
