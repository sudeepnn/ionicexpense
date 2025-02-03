import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DayModalPage } from './day-modal.page';

describe('DayModalPage', () => {
  let component: DayModalPage;
  let fixture: ComponentFixture<DayModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DayModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
