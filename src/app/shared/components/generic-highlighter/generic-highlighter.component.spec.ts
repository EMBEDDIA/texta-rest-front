import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericHighlighterComponent } from './generic-highlighter.component';

describe('GenericHighlighterComponent', () => {
  let component: GenericHighlighterComponent;
  let fixture: ComponentFixture<GenericHighlighterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericHighlighterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericHighlighterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
