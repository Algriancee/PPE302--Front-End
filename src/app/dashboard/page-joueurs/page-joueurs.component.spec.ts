import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageJoueursComponent } from './page-joueurs.component';

describe('PageJoueursComponent', () => {
  let component: PageJoueursComponent;
  let fixture: ComponentFixture<PageJoueursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageJoueursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageJoueursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
