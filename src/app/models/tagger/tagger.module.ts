import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {CreateTaggerDialogComponent} from './create-tagger-dialog/create-tagger-dialog.component';
import {EditTaggerDialogComponent} from './edit-tagger-dialog/edit-tagger-dialog.component';
import {EditStopwordsDialogComponent} from './edit-stopwords-dialog/edit-stopwords-dialog.component';
import {ListFeaturesDialogComponent} from './list-features-dialog/list-features-dialog.component';
import {TagDocDialogComponent} from './tag-doc-dialog/tag-doc-dialog.component';
import {TagRandomDocDialogComponent} from './tag-random-doc-dialog/tag-random-doc-dialog.component';
import {TagTextDialogComponent} from './tag-text-dialog/tag-text-dialog.component';
import {TaggerRoutingModule} from './tagger-routing.module';
import {TaggerComponent} from './tagger.component';
import { ApplyToIndexDialogComponent } from './apply-to-index-dialog/apply-to-index-dialog.component';


@NgModule({
  declarations: [
    CreateTaggerDialogComponent,
    EditStopwordsDialogComponent,
    EditTaggerDialogComponent,
    ListFeaturesDialogComponent,
    TagDocDialogComponent,
    TagRandomDocDialogComponent,
    TagTextDialogComponent,
    TaggerComponent,
    ApplyToIndexDialogComponent
  ],
  imports: [
    SharedModule,
    TaggerRoutingModule,
  ],
})
export class TaggerModule {
}
