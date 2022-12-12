import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
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
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatChipsModule} from '@angular/material/chips';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
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
import {SavedSearchAutocompleteComponent} from './components/saved-search-autocomplete/saved-search-autocomplete.component';
import {BarChartModule} from '@swimlane/ngx-charts';
import {MatTreeModule} from '@angular/material/tree';
import {FormatTextaFactsPipe} from './pipes/format-texta-facts.pipe';
import {IsObjectPipe} from './pipes/is-object.pipe';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {MatRadioModule} from '@angular/material/radio';
import {GroupSameValuesPipe} from './pipes/group-same-values.pipe';
import {GetPropertyListPipe} from './pipes/get-property-list.pipe';
import {JoinPipe} from './pipes/join.pipe';
import {RouterModule} from '@angular/router';
import {FromToInputComponent} from './components/from-to-input/from-to-input.component';
import {ScrollTopDirective} from './directives/scroll-top.directive';
import {PortalModule} from '@angular/cdk/portal';
import {OverlayModule} from '@angular/cdk/overlay';
import {FactChipComponent} from './components/fact-chip/fact-chip.component';
import {GenericHighlighterComponent} from './components/generic-highlighter/generic-highlighter.component';
import {AccessorPipe} from './pipes/accessor.pipe';
import {TaggerFineTuneSliderComponent} from './components/tagger-fine-tune-slider/tagger-fine-tune-slider.component';
import {A11yModule, FocusMonitor} from '@angular/cdk/a11y';
import {ProjectGuardDialogComponent} from './components/dialogs/project-guard-dialog/project-guard-dialog.component';
import {TextareaLexiconComponent} from './components/textarea-lexicon/textarea-lexicon.component';
import {CombineArrayPipe} from './pipes/combine-array.pipe';
import {ProjectFieldSelectComponent} from './components/project-field-select/project-field-select.component';
import {ParseJsonPipe} from './pipes/parse-json.pipe';
import {TextaFactsChipsComponent} from './components/texta-facts-chips/texta-facts-chips.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {AddLexiconDialogComponent} from './components/dialogs/add-lexicon-dialog/add-lexicon-dialog.component';
import {TagRandomDocResultComponent} from './components/dialogs/tag-random-doc-result/tag-random-doc-result.component';
import {FileInputComponent} from './components/file-input/file-input.component';
import {ByteFormatPipe} from './pipes/byte-format.pipe';
import {BreadcrumbComponent} from './components/breadcrumb/breadcrumb.component';
import {ConfirmBulkDeleteDialogComponent} from './components/dialogs/confirm-bulk-delete-dialog/confirm-bulk-delete-dialog.component';
import {InfoIconComponent} from './components/info-icon/info-icon.component';
import {InfoIconPortalComponent} from './components/info-icon/info-icon-portal/info-icon-portal.component';
import {
  LuxonDateAdapter,
  MAT_LUXON_DATE_ADAPTER_OPTIONS,
  MAT_LUXON_DATE_FORMATS,
  MatLuxonDateModule
} from '@angular/material-luxon-adapter';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import {TaskMenuComponent} from './components/task-table/task-menu/task-menu.component';
import {TaskTableComponent} from './components/task-table/task-table.component';
import {TaskProgressComponent} from './components/task-progress/task-progress.component';
import {DocsButtonComponent} from './components/docs-button/docs-button.component';
import {NgxVirtualScrollMatSelectModule, VS_SELECT_CONFIG_TOKEN} from '@texta/ngx-virtual-scroll-mat-select';

@NgModule({
  declarations: [LoginDialogComponent, GenericTableComponent,
    RegistrationDialogComponent,
    ConfirmDialogComponent,
    AddLexiconDialogComponent,
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
    FromToInputComponent,
    ScrollTopDirective,
    FactChipComponent,
    GenericHighlighterComponent,
    AccessorPipe,
    TaggerFineTuneSliderComponent,
    ProjectGuardDialogComponent,
    TextareaLexiconComponent,
    CombineArrayPipe,
    ParseJsonPipe,
    ProjectFieldSelectComponent,
    TextaFactsChipsComponent,
    TagRandomDocResultComponent,
    FileInputComponent,
    ByteFormatPipe,
    ConfirmBulkDeleteDialogComponent,
    InfoIconComponent,
    InfoIconPortalComponent,
    TaskMenuComponent,
    TaskTableComponent,
    TaskProgressComponent,
    DocsButtonComponent,
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
    MatButtonToggleModule,
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
    MatLuxonDateModule,
    MatTooltipModule,
    MatSliderModule,
    MatTreeModule,
    MatRadioModule,
    BarChartModule,
    PortalModule,
    OverlayModule,
    A11yModule,
    NgxMatSelectSearchModule,
    NgxVirtualScrollMatSelectModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonToggleModule,
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
    MatLuxonDateModule,
    MatTooltipModule,
    MatSliderModule,
    MatTreeModule,
    MatRadioModule,
    GenericTableComponent,
    SavedSearchAutocompleteComponent,
    MatOptionSelectAllComponent,
    FormatTextaFactsPipe,
    IsObjectPipe,
    BarChartModule,
    GroupSameValuesPipe,
    NgxMatSelectSearchModule,
    NgxVirtualScrollMatSelectModule,
    GetPropertyListPipe,
    JoinPipe,
    BreadcrumbComponent,
    FromToInputComponent,
    PortalModule,
    OverlayModule,
    ScrollTopDirective,
    FactChipComponent,
    A11yModule,
    GenericHighlighterComponent,
    TaggerFineTuneSliderComponent,
    TextareaLexiconComponent,
    ProjectFieldSelectComponent,
    CombineArrayPipe,
    ParseJsonPipe,
    TextaFactsChipsComponent,
    TagRandomDocResultComponent,
    FileInputComponent,
    ByteFormatPipe,
    InfoIconComponent,
    TaskMenuComponent,
    TaskTableComponent,
    TaskProgressComponent,
    DocsButtonComponent,

  ],
  providers: [FocusMonitor,
    {provide: MAT_LUXON_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}},
    {provide: MAT_LUXON_DATE_FORMATS, useValue: 'en-NZ'},
    {provide: DateAdapter, useClass: LuxonDateAdapter, deps: [MAT_LUXON_DATE_FORMATS, MAT_LUXON_DATE_ADAPTER_OPTIONS]},
    {provide: VS_SELECT_CONFIG_TOKEN, useValue: {itemSize: 48}}
  ]
})
export class SharedModule {
}
