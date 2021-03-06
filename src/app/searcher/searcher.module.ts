import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {SearcherRoutingModule} from './searcher-routing.module';
import {TextConstraintsComponent} from './searcher-sidebar/build-search/advanced-search/text-constraints/text-constraints.component';
import {DateConstraintsComponent} from './searcher-sidebar/build-search/advanced-search/date-constraints/date-constraints.component';
import {FactConstraintsComponent} from './searcher-sidebar/build-search/advanced-search/fact-constraints/fact-constraints.component';
import {SearcherComponent} from './searcher.component';
import {SearcherSidebarComponent} from './searcher-sidebar/searcher-sidebar.component';
import {SearcherTableComponent} from './searcher-table/searcher-table.component';
import {BuildSearchComponent} from './searcher-sidebar/build-search/build-search.component';
import {SavedSearchesComponent} from './searcher-sidebar/saved-searches/saved-searches.component';
import {SaveSearchDialogComponent} from './searcher-sidebar/dialogs/save-search-dialog/save-search-dialog.component';
import {HighlightComponent} from './searcher-table/highlight/highlight.component';
import {AggregationsComponent} from './searcher-sidebar/aggregations/aggregations.component';
import {AggregationResultsComponent} from './aggregation-results/aggregation-results.component';
import {DateAggregationComponent} from './searcher-sidebar/aggregations/date-aggregation/date-aggregation.component';
import {TextAggregationComponent} from './searcher-sidebar/aggregations/text-aggregation/text-aggregation.component';
import {AggregationResultTableComponent} from './aggregation-results/aggregation-result-table/aggregation-result-table.component';
import {AggregationResultsDialogComponent} from './aggregation-results/aggregation-results-dialog/aggregation-results-dialog.component';
import {AggregationResultsTreeComponent} from './aggregation-results/aggregation-results-tree/aggregation-results-tree.component';
import {DatePipe} from '@angular/common';
import {AggregationResultsChartComponent} from './aggregation-results/aggregation-results-chart/aggregation-results-chart.component';
import {SimpleSearchComponent} from './searcher-sidebar/build-search/simple-search/simple-search.component';
import {AdvancedSearchComponent} from './searcher-sidebar/build-search/advanced-search/advanced-search.component';
import {NumberConstraintsComponent} from './searcher-sidebar/build-search/advanced-search/number-constraints/number-constraints.component';
import {AggregationResultFactsComponent} from './aggregation-results/aggregation-result-facts/aggregation-result-facts.component';
import {GraphSelectedPortalComponent} from './aggregation-results/aggregation-results-chart/graph-selected-portal/graph-selected-portal.component';
import {EditSavedSearchDialogComponent} from './searcher-sidebar/saved-searches/edit-saved-search-dialog/edit-saved-search-dialog.component';
import {SearcherComponentService} from './services/searcher-component.service';
import {PlotlyViaWindowModule} from 'angular-plotly.js';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { AddLexiconDialogComponent } from './aggregation-results/aggregation-result-table/add-lexicon-dialog/add-lexicon-dialog.component';
@NgModule({
  declarations: [
    SearcherComponent,
    SearcherSidebarComponent,
    SearcherTableComponent,
    BuildSearchComponent,
    TextConstraintsComponent,
    DateConstraintsComponent,
    FactConstraintsComponent,
    SavedSearchesComponent,
    SaveSearchDialogComponent,
    HighlightComponent,
    AggregationsComponent,
    AggregationResultsComponent,
    DateAggregationComponent,
    TextAggregationComponent,
    AggregationResultTableComponent,
    AggregationResultsDialogComponent,
    AggregationResultsTreeComponent,
    AggregationResultsChartComponent,
    SimpleSearchComponent,
    AdvancedSearchComponent,
    NumberConstraintsComponent,
    AggregationResultFactsComponent,
    GraphSelectedPortalComponent,
    EditSavedSearchDialogComponent,
    AddLexiconDialogComponent,
  ],
  imports: [
    SharedModule,
    PlotlyViaWindowModule,
    SearcherRoutingModule,
    DragDropModule
  ],
  exports: [
    HighlightComponent
  ],
  providers: [SearcherComponentService, DatePipe]
})
export class SearcherModule {
  constructor() {
  }
}
