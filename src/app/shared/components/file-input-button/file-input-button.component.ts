import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-file-input-button',
  templateUrl: './file-input-button.component.html',
  styleUrls: ['./file-input-button.component.scss']
})
export class FileInputButtonComponent implements OnInit {
  @Output() fileChanged: EventEmitter<File> = new EventEmitter<File>();

  constructor() {
  }

  ngOnInit() {
  }

  onFileSelected() {
    const inputNode: any = document.querySelector('#file');
    if (inputNode && inputNode.files[0]) {
      this.fileChanged.emit(inputNode.files[0]);
      inputNode.value = '';
    }
  }

}
