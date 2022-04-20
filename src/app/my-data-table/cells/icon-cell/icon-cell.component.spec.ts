import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateCellComponent } from './string-cell.component';

describe('StringCellComponent', () => {
  let component: DateCellComponent;
  let fixture: ComponentFixture<DateCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateCellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
