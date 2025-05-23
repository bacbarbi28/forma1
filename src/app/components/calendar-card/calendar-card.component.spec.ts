import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarCardComponent } from './calendar-card.component';

describe('CalendarCardComponent', () => {
  let component: CalendarCardComponent;
  let fixture: ComponentFixture<CalendarCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
