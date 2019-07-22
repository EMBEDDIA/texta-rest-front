import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {UserSettingsComponent} from './user-settings/user-settings.component';
import {AuthGuard} from './core/auth/auth.guard';
import {HomeComponent} from './home/home.component';
import {ProjectComponent} from './project/project.component';
import {EmbeddingComponent} from './embedding/embedding.component';
import {TaggerComponent} from './tagger/tagger.component';
import {UsersComponent} from './users/users.component';
import {TaggerGroupComponent} from './tagger-group/tagger-group.component';
import {EmbeddingGroupComponent} from './embedding-group/embedding-group.component';
import {LexiconMinerComponent} from './lexicon-miner/lexicon-miner.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'projects',
    canActivate: [AuthGuard],
    component: ProjectComponent,
  },
  {
    path: 'taggers',
    canActivate: [AuthGuard],
    component: TaggerComponent,
  },
  {
    path: 'embeddings',
    canActivate: [AuthGuard],
    component: EmbeddingComponent,
  },
  {
    path: 'tagger',
    canActivate: [AuthGuard],
    component: TaggerComponent,
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    component: UsersComponent,
  },
  {
    path: 'tagger-group',
    canActivate: [AuthGuard],
    component: TaggerGroupComponent,
  },
  {
    path: 'embedding-group',
    canActivate: [AuthGuard],
    component: EmbeddingGroupComponent,
  },
  {
    path: 'lexicon-miner',
    canActivate: [AuthGuard],
    component: LexiconMinerComponent,
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    component: UserSettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
