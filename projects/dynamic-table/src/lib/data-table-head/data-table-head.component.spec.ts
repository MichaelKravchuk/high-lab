import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableHeadComponent } from './data-table-head.component';

describe('DataTableHeadComponent', () => {
  let component: DataTableHeadComponent;
  let fixture: ComponentFixture<DataTableHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataTableHeadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTableHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
