import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageAccueilleComponent } from './page-accueille.component';

describe('PageAccueilleComponent', () => {
  let component: PageAccueilleComponent;
  let fixture: ComponentFixture<PageAccueilleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageAccueilleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageAccueilleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
