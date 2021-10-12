import { ModuleWithProviders, NgModule } from '@angular/core';
import {CRFExtractorComponent} from './crf-extractor.component';
import { CreateCRFExtractorDialogComponent } from './create-crf-extractor-dialog/create-crf-extractor-dialog.component';
import {CRFExtractorRoutingModule} from './crf-extractor-routing.module';
import {SharedModule} from '../../shared/shared.module';
import { TagTextDialogComponent } from './tag-text-dialog/tag-text-dialog.component';
import { ApplyToIndexDialogComponent } from './apply-to-index-dialog/apply-to-index-dialog.component';

@NgModule({
    imports: [
        SharedModule,
        CRFExtractorRoutingModule,
    ],
    declarations: [
    CRFExtractorComponent,
    CreateCRFExtractorDialogComponent,
    TagTextDialogComponent,
    ApplyToIndexDialogComponent
    ],
    providers: [],
 })
export class CRFExtractorModule {
}
