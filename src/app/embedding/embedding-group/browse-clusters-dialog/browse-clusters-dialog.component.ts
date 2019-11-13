import { Component, OnInit, Inject } from '@angular/core';
import { EmbeddingsGroupService } from 'src/app/core/embeddings/embeddings-group.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LogService } from 'src/app/core/util/log.service';
import { HttpErrorResponse } from '@angular/common/http';


interface BrowseClustersResponse {
  items: string[];
  size: number;
  etalon: string;
}


@Component({
  selector: 'app-browse-clusters-dialog',
  templateUrl: './browse-clusters-dialog.component.html',
  styleUrls: ['./browse-clusters-dialog.component.scss']
})
export class BrowseClustersDialogComponent implements OnInit {
  options: any;
  result: BrowseClustersResponse[] = [];

  browseClustersForm: FormGroup;


  constructor(private embGroupService: EmbeddingsGroupService, private logService: LogService,
    @Inject(MAT_DIALOG_DATA) public data: { currentProjectId: number, embeddingClusterId: number; }) {
  }

  ngOnInit() {
    this.embGroupService.getBrowseClustersOptions(this.data.currentProjectId, this.data.embeddingClusterId)
      .subscribe(options => {
        this.options = options;

        this.browseClustersForm = new FormGroup({
          cluster_order: new FormControl(this.options.actions.POST.cluster_order.choices[0].value, Validators.required),
          number_of_clusters: new FormControl(50, Validators.required),
          max_examples_per_cluster: new FormControl(10, Validators.required),
        })
      });
 
  }

  onSubmit() {
    if (this.browseClustersForm.valid) {
      this.embGroupService.browseClusters(this.data.currentProjectId, this.data.embeddingClusterId, this.browseClustersForm.getRawValue())
        .subscribe((resp: BrowseClustersResponse[] | HttpErrorResponse) => {
          if (resp && !(resp instanceof HttpErrorResponse)) {
            this.result = resp;
          } else if (resp instanceof HttpErrorResponse){
            this.logService.snackBarError(resp, 4000);
          }
        });
    }
  }

}
