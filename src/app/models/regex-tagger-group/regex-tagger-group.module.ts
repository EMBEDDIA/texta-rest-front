import { ModuleWithProviders, NgModule } from '@angular/core';
import {RegexTaggerGroupComponent} from './regex-tagger-group.component';
import { CreateRegexTaggerGroupDialogComponent } from './create-regex-tagger-group-dialog/create-regex-tagger-group-dialog.component';
import {RegexTaggerGroupRoutingModule} from './regex-tagger-group-routing.module';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        RegexTaggerGroupRoutingModule,
    ],
    declarations: [
    RegexTaggerGroupComponent,
    CreateRegexTaggerGroupDialogComponent
    ],
    providers: [],
 })
export class RegexTaggerGroupModule {
}
