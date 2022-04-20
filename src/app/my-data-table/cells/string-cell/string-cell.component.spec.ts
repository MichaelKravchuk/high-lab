import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StringCellComponent } from './string-cell.component';

describe('StringCellComponent', () => {
  let component: StringCellComponent;
  let fixture: ComponentFixture<StringCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StringCellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StringCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
