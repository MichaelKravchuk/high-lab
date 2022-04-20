import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateCellComponent } from './string-cell.component';

describe('StringCellComponent', () => {
  let component: TemplateCellComponent;
  let fixture: ComponentFixture<TemplateCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateCellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
