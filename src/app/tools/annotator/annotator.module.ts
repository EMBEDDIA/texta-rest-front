import { ModuleWithProviders, NgModule } from '@angular/core';
import {AnnotatorComponent} from './annotator.component';
import { CreateAnnotatorDialogComponent } from './create-annotator-dialog/create-annotator-dialog.component';
import {AnnotatorRoutingModule} from './annotator-routing.module';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        AnnotatorRoutingModule,
    ],
    declarations: [
    AnnotatorComponent,
    CreateAnnotatorDialogComponent
    ],
    providers: [],
 })
export class AnnotatorModule {
}
